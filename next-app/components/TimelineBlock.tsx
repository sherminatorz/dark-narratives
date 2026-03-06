interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineBlockProps {
  events: TimelineEvent[];
}

export default function TimelineBlock({ events }: TimelineBlockProps) {
  return (
    <div className="relative my-12 pl-8 border-l-2 border-crimson/40">
      {events.map((event, i) => (
        <div key={i} className="relative mb-10 last:mb-0">
          {/* Marker dot */}
          <div className="absolute -left-[calc(2rem+5px)] top-1 w-3 h-3 rounded-full bg-crimson ring-4 ring-background" />

          <time className="block text-xs font-bold uppercase tracking-widest text-crimson mb-1">
            {event.date}
          </time>
          <h4 className="text-lg font-display font-semibold text-foreground mb-1">
            {event.title}
          </h4>
          <p className="text-foreground-muted text-sm leading-relaxed">
            {event.description}
          </p>
        </div>
      ))}
    </div>
  );
}
