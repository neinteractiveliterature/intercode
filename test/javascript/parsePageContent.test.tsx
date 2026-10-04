import { isValidElement } from 'react';
import { Mock, vi } from 'vitest';
import parsePageContent, { ScriptTag } from '../../app/javascript/parsePageContent';
import SignInButton from '../../app/javascript/Authentication/SignInButton';
import SignOutButton from '../../app/javascript/Authentication/SignOutButton';
import SignUpButton from '../../app/javascript/Authentication/SignUpButton';
import { render } from './testUtils';

const warning: Mock = vi.hoisted(() => vi.fn());
vi.mock('ErrorReporting', () => ({ default: () => ({ warning }) }));

async function renderBody(content: string, componentMap?: Parameters<typeof parsePageContent>[1]) {
  const { bodyComponents } = parsePageContent(content, componentMap);
  return await render(<div data-testid="content">{bodyComponents}</div>);
}

describe('parsePageContent', () => {
  beforeEach(() => {
    warning.mockClear();
  });

  describe('plain HTML', () => {
    it('renders text and nested elements', async () => {
      const { getByTestId } = await renderBody('<p>Hello <strong>there</strong>, world</p>');

      expect(getByTestId('content').innerHTML).toBe('<p>Hello <strong>there</strong>, world</p>');
    });

    it('renders several top-level elements', async () => {
      const { getByTestId } = await renderBody('<h1>Title</h1><p>Body</p>');

      expect(getByTestId('content').innerHTML).toBe('<h1>Title</h1><p>Body</p>');
    });

    it('renders void elements without children', async () => {
      const { getByTestId } = await renderBody('<p>line one<br>line two<img src="/pic.png" alt="a pic"></p>');

      const content = getByTestId('content');
      expect(content.querySelector('br')).not.toBeNull();
      expect(content.querySelector('img')?.getAttribute('src')).toBe('/pic.png');
      expect(content.querySelector('img')?.getAttribute('alt')).toBe('a pic');
    });

    it('leaves out HTML comments', async () => {
      const { getByTestId } = await renderBody('<p>Visible</p><!-- hidden -->');

      expect(getByTestId('content').textContent).toBe('Visible');
    });

    it('renders nothing for empty content', async () => {
      const { getByTestId } = await renderBody('');

      expect(getByTestId('content').innerHTML).toBe('');
    });
  });

  describe('attributes', () => {
    it('translates HTML attribute names to their React equivalents', async () => {
      const { getByTestId } = await renderBody(
        '<label for="name" class="form-label" tabindex="2">Name</label><input id="name" maxlength="5" placeholder="Your name">',
      );

      const label = getByTestId('content').querySelector('label');
      expect(label?.getAttribute('for')).toBe('name');
      expect(label?.className).toBe('form-label');
      expect(label?.getAttribute('tabindex')).toBe('2');
      const input = getByTestId('content').querySelector('input');
      expect(input?.getAttribute('maxlength')).toBe('5');
      expect(input?.getAttribute('placeholder')).toBe('Your name');
    });

    it('turns inline style strings into style objects', async () => {
      const { getByTestId } = await renderBody('<p style="color: red; margin-top: 4px">Styled</p>');

      const style = getByTestId('content').querySelector('p')?.style;
      expect(style?.color).toBe('red');
      expect(style?.marginTop).toBe('4px');
    });

    it('keeps colons and base64 semicolons inside style values', async () => {
      const { getByTestId } = await renderBody(
        '<div style="background-image: url(data:image/png;base64,AAAA); color: blue">x</div>',
      );

      const style = getByTestId('content').querySelector('div')?.style;
      expect(style?.backgroundImage).toContain('data:image/png;base64,AAAA');
      expect(style?.color).toBe('blue');
    });

    it('ignores empty style declarations', async () => {
      const { getByTestId } = await renderBody('<p style=";color: green;;">x</p>');

      expect(getByTestId('content').querySelector('p')?.style.color).toBe('green');
    });

    it('drops attributes the browser would reject, and reports them', async () => {
      const { getByTestId } = await renderBody('<p data-ok="yes" ="oops" 1bad="no">x</p>');

      const paragraph = getByTestId('content').querySelector('p');
      expect(paragraph?.getAttribute('data-ok')).toBe('yes');
      expect(warning).toHaveBeenCalledWith(
        expect.stringMatching(/^Invalid attribute .* for P while parsing CMS content$/),
      );
    });

    it('runs an onload attribute as a handler when the element loads', async () => {
      const { getByTestId } = await renderBody('<img src="/x.png" onload="window.parsedOnloadRan = true">');

      getByTestId('content').querySelector('img')?.dispatchEvent(new Event('load'));

      expect((window as typeof window & { parsedOnloadRan?: boolean }).parsedOnloadRan).toBe(true);
    });
  });

  describe('links', () => {
    it('renders links to the same site as client-side router links', async () => {
      const { getByRole } = await renderBody(
        `<a href="${window.location.origin}/events" class="nav" title="Events">Events</a>`,
      );

      const link = getByRole('link', { name: 'Events' });
      expect(link.getAttribute('href')).toBe(`${window.location.origin}/events`);
      expect(link.className).toBe('nav');
      expect(link.getAttribute('title')).toBe('Events');
    });

    it('renders relative links as router links too', async () => {
      const { getByRole } = await renderBody('<a href="/pages/about">About</a>');

      expect(getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/pages/about');
    });

    it('renders links to other sites, and same-page anchors, as plain anchors with all their attributes', async () => {
      const { getByRole } = await renderBody(
        '<a href="https://example.com/x" target="_blank" rel="noopener">Out</a><a href="#top" name="t">Top</a>',
      );

      const external = getByRole('link', { name: 'Out' });
      expect(external.getAttribute('href')).toBe('https://example.com/x');
      expect(external.getAttribute('target')).toBe('_blank');
      expect(external.getAttribute('rel')).toBe('noopener');
      expect(getByRole('link', { name: 'Top' }).getAttribute('href')).toBe('#top');
    });

    it('renders links with no href as plain anchors', async () => {
      const { getByTestId } = await renderBody('<a name="anchor">Anchor</a>');

      expect(getByTestId('content').querySelector('a')?.getAttribute('name')).toBe('anchor');
    });
  });

  describe('authentication links', () => {
    function firstElement(content: string) {
      const { bodyComponents } = parsePageContent(content);
      if (!isValidElement<{ className?: string; caption?: string }>(bodyComponents)) {
        throw new Error('expected a single element');
      }
      return bodyComponents;
    }

    it('replaces sign in, sign up and sign out links with their buttons', () => {
      expect(firstElement('<a href="/users/sign_in">Log in</a>').type).toBe(SignInButton);
      expect(firstElement('<a href="/users/sign_up">Register</a>').type).toBe(SignUpButton);
      expect(firstElement('<a href="/users/sign_out">Log out</a>').type).toBe(SignOutButton);
    });

    it('keeps the link text as the button caption', () => {
      expect(firstElement('<a href="/users/sign_in">Come on in</a>').props).toMatchObject({ caption: 'Come on in' });
    });

    it('uses the link’s class if it has one, and a default style otherwise', () => {
      expect(firstElement('<a href="/users/sign_in" class="mine">x</a>').props).toMatchObject({ className: 'mine' });
      expect(firstElement('<a href="/users/sign_in">x</a>').props).toMatchObject({
        className: 'btn btn-link d-inline p-0',
      });
      expect(firstElement('<a href="/users/sign_up">x</a>').props).toMatchObject({
        className: 'btn btn-primary btn-sm',
      });
      expect(firstElement('<a href="/users/sign_out">x</a>').props.className).toBeUndefined();
    });

    it('matches on the end of the href, so full URLs work', () => {
      expect(firstElement('<a href="https://example.com/users/sign_in">x</a>').type).toBe(SignInButton);
    });

    it('renders as a button', async () => {
      const { getByRole } = await renderBody('<a href="/users/sign_in">Come on in</a>');

      expect(getByRole('button', { name: 'Come on in' })).toBeTruthy();
    });
  });

  describe('embedded React components', () => {
    const Greeting = ({ name }: { name: string }) => <p data-testid="greeting">Hello, {name}!</p>;

    it('renders components named by data-react-class with their data-react-props', async () => {
      const { getByTestId } = await renderBody(
        '<div data-react-class="Greeting" data-react-props=\'{"name":"Larpers"}\'></div>',
        { Greeting },
      );

      expect(getByTestId('greeting').textContent).toBe('Hello, Larpers!');
    });

    it('passes no props when data-react-props is missing', async () => {
      const Counter = (props: Record<string, unknown>) => <p data-testid="props">{JSON.stringify(props)}</p>;

      const { getByTestId } = await renderBody('<div data-react-class="Counter"></div>', { Counter });

      expect(getByTestId('props').textContent).toBe('{}');
    });

    it('renders unknown component names as ordinary elements', async () => {
      const { getByTestId } = await renderBody('<div data-react-class="Nope" id="plain">stays</div>', { Greeting });

      expect(getByTestId('content').querySelector('#plain')?.textContent).toBe('stays');
    });

    it('includes the built-in components by default', async () => {
      const { getByRole } = await renderBody(
        '<span data-react-class="SignInButton" data-react-props=\'{"caption":"In"}\'></span>',
      );

      expect(getByRole('button', { name: 'In' })).toBeTruthy();
    });
  });

  describe('head content', () => {
    it('returns the parsed contents of the head separately from the body', async () => {
      const { bodyComponents, headComponents } = parsePageContent(
        '<html><head><title>Page title</title></head><body><p>Body text</p></body></html>',
      );

      const { getByTestId } = await render(
        <>
          {headComponents}
          <div data-testid="body">{bodyComponents}</div>
        </>,
      );

      // React moves <title> into the document head, which is how CMS pages set their title
      expect(document.title).toBe('Page title');
      expect(getByTestId('body').textContent).toBe('Body text');
      expect(getByTestId('body').querySelector('title')).toBeNull();
    });

    it('treats a script at the very start of the content as head content', () => {
      const { bodyComponents, headComponents } = parsePageContent('<script>window.early = true</script><p>Body</p>');

      expect(isValidElement(headComponents)).toBe(true);
      expect(isValidElement(bodyComponents)).toBe(true);
    });
  });

  describe('ScriptTag', () => {
    afterEach(() => {
      document.querySelectorAll('script[data-test-script]').forEach((script) => script.remove());
    });

    it('swaps itself for a real script element with the given content', async () => {
      const { container } = await render(<ScriptTag url={null} content="window.scriptTagRan = true" />);

      const script = container.querySelector('script');
      expect(script).not.toBeNull();
      expect(script?.textContent).toBe('window.scriptTagRan = true');
      expect(script?.hasAttribute('src')).toBe(false);
    });

    it('loads scripts from a URL asynchronously', async () => {
      const { container } = await render(<ScriptTag url="https://example.com/widget.js" content={null} />);

      const script = container.querySelector('script');
      expect(script?.getAttribute('src')).toBe('https://example.com/widget.js');
      expect(script?.async).toBe(true);
    });

    it('puts the placeholder back when unmounted', async () => {
      const { container, unmount } = await render(<ScriptTag url={null} content="1" />);
      expect(container.querySelector('script')).not.toBeNull();

      unmount();

      expect(container.querySelector('script')).toBeNull();
    });

    it('renders script tags in page content', async () => {
      const { getByTestId } = await renderBody('<p>Before</p><script>window.pageScriptRan = true</script>');

      expect(getByTestId('content').querySelector('script')?.textContent).toBe('window.pageScriptRan = true');
    });
  });
});
