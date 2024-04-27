export type RankedChoicePriorityIndicatorProps = {
  priority: number | null | undefined;
  fontSize: number;
};

export default function RankedChoicePriorityIndicator({ priority, fontSize }: RankedChoicePriorityIndicatorProps) {
  return (
    <div
      className="text-center rounded-circle d-inline-block align-baseline"
      style={{ width: `${fontSize * 1.5 + 4}px`, fontSize: `${fontSize}px`, border: '2px solid' }}
    >
      {priority}
    </div>
  );
}
