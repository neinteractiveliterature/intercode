export type GravatarProps = {
  url?: string;
  enabled?: boolean;
  pixelSize: number;
  imgClassName?: string;
};

function Gravatar({ url, enabled, pixelSize, imgClassName }: GravatarProps): React.JSX.Element {
  if (!url || !(enabled ?? true)) {
    return (
      <span className="d-inline-block" style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}>
        <i className="bi-person-circle" style={{ fontSize: `${pixelSize}px` }} />
      </span>
    );
  }

  return (
    <img
      src={`${url}?s=${pixelSize * 2}`} // for retina displays
      alt=""
      className={`${imgClassName || ''}`}
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        borderRadius: `${pixelSize / 2}px`,
      }}
    />
  );
}

export default Gravatar;
