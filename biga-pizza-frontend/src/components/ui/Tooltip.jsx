// components/ui/Tooltip.jsx
// import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export const Tooltip = ({ children, content }) => (
  <RadixTooltip.Provider delayDuration={400}>
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side="top"
          className="max-w-xs rounded bg-white px-3 py-2 text-sm text-gray-800 shadow-lg border border-gray-200 data-[state=delayed-open]:animate-fade-in data-[state=closed]:animate-fade-out"
        >
          {content}
          <RadixTooltip.Arrow className="fill-white" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);

export default Tooltip;
