// components/ui/Tooltip.jsx
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export default function Tooltip({ children, content, side = "top", align = "center" }) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className="z-50 max-w-xs rounded-md bg-gray-800 px-3 py-2 text-sm text-white shadow-lg data-[state=delayed-open]:animate-fade-in data-[state=closed]:animate-fade-out"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-800" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
