import moment from 'moment-timezone';

export default function getSortedRuns(event) {
  return [...event.runs].sort((a, b) => (
    moment(a.starts_at).valueOf() - moment(b.starts_at).valueOf()
  ));
}
