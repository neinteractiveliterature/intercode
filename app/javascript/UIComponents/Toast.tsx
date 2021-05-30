import { ReactNode, useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

export const TOAST_FADE_DURATION = 350;

export type ToastProps = {
  title: ReactNode;
  children: ReactNode;
  visible: boolean;
  close: () => void;
  autoCloseAfter?: number;
};

export default function Toast({ title, children, visible, close, autoCloseAfter }: ToastProps) {
  const [timestamp, setTimestamp] = useState(() => DateTime.now());
  const [formattedTimeAgo, setFormattedTimeAgo] = useState<string | null>(null);
  const { t } = useTranslation();
  const justNow = t('justNow', 'just now');
  const [visibilityClass, setVisibilityClass] = useState(justNow);

  useEffect(() => {
    let timeout: number | undefined;
    if (visible) {
      setTimestamp(DateTime.now());
      setVisibilityClass('fade showing');
      timeout = window.setTimeout(() => {
        setVisibilityClass('fade show');
      }, TOAST_FADE_DURATION);
    } else {
      setVisibilityClass('fade');
      timeout = window.setTimeout(() => {
        setVisibilityClass('fade hide');
      }, TOAST_FADE_DURATION);
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const handle = window.setInterval(() => {
        if (autoCloseAfter && timestamp.diffNow('millisecond').milliseconds >= autoCloseAfter) {
          close();
        }

        if (timestamp.diffNow('minute').minutes < 1) {
          setFormattedTimeAgo(justNow);
        } else {
          setFormattedTimeAgo(timestamp.toRelative());
        }
      }, 1000 * 15);
      return () => {
        window.clearInterval(handle);
      };
    }
  }, [timestamp, visible, close]);

  return (
    <div
      className={`toast ${visibilityClass}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header">
        <span className="mr-auto flex-grow-1">{title}</span>
        <small className="text-muted">{formattedTimeAgo}</small>
        <button
          type="button"
          className="ms-2 mb-1 btn-close"
          data-dismiss="toast"
          aria-label="Close"
          onClick={close}
        />
      </div>
      <div className="toast-body">{children}</div>
    </div>
  );
}
