import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg margin-right--md" to="/docs/intro">
            Documentation
          </Link>

          <Link className="button button--secondary button--lg" to="/blog">
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation site for Intercode, an app for convention web sites"
    >
      <HomepageHeader />
      <main>
        <div className="container margin-top--lg">
          <p>
            Welcome to the documentation site for Intercode, a web application for conventions.
            Intercode handles content management, registration, payments, event proposals, and more.
          </p>

          <p>
            This site has a user guide for Intercode as well as a technical reference manual for
            Intercode's GraphQL API. Both of these are very much works in progress. If you'd like to
            contribute to this site, we have links on each page to edit things via a pull request on
            Github!
          </p>
        </div>
      </main>
    </Layout>
  );
}
