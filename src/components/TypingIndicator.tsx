export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">🤖</span>
      </div>
      <div className="glass-effect border border-border/50 rounded-2xl px-4 py-3 rounded-bl-sm">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};
