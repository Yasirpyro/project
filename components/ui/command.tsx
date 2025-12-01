'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Search } from 'lucide-react';
import {
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  type ListBoxProps,
} from 'react-aria-components';
import { useFilter } from 'react-aria';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type CommandContextValue = {
  query: string;
  setQuery: (value: string) => void;
  filterText: (source: string, query: string) => boolean;
  registerVisibility: (id: string, visible: boolean) => void;
  unregisterVisibility: (id: string) => void;
  visibleCount: number;
};

const CommandContext = React.createContext<CommandContextValue | null>(null);

const useCommandContext = () => {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error('Command components must be used within <Command>.');
  }
  return context;
};

type CommandProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
};

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, defaultValue = '', ...props }, ref) => {
    const [query, setQuery] = React.useState(defaultValue);
    const [visibleCount, setVisibleCount] = React.useState(0);
    const visibilityMap = React.useRef(new Map<string, boolean>());
    const { contains } = useFilter({ sensitivity: 'base' });

    const updateVisibleCount = React.useCallback(() => {
      let count = 0;
      visibilityMap.current.forEach((value) => {
        if (value) count += 1;
      });
      setVisibleCount(count);
    }, []);

    const registerVisibility = React.useCallback(
      (id: string, visible: boolean) => {
        const prev = visibilityMap.current.get(id);
        if (prev === visible) return;
        visibilityMap.current.set(id, visible);
        updateVisibleCount();
      },
      [updateVisibleCount]
    );

    const unregisterVisibility = React.useCallback(
      (id: string) => {
        if (visibilityMap.current.delete(id)) {
          updateVisibleCount();
        }
      },
      [updateVisibleCount]
    );

    const value = React.useMemo<CommandContextValue>(
      () => ({
        query,
        setQuery,
        filterText: (source, target) => contains(source, target),
        registerVisibility,
        unregisterVisibility,
        visibleCount,
      }),
      [contains, query, registerVisibility, unregisterVisibility, visibleCount]
    );

    return (
      <CommandContext.Provider value={value}>
        <div
          ref={ref}
          data-command-root=""
          className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);
Command.displayName = 'Command';

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[data-command-group-label]]:px-2 [&_[data-command-group-label]]:font-medium [&_[data-command-group-label]]:text-muted-foreground [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-group]]:px-2 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, onChange, ...props }, ref) => {
    const { query, setQuery } = useCommandContext();

    return (
      <div className="flex items-center border-b px-3" data-command-input-wrapper="">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          ref={ref}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange?.(event);
          }}
          className={cn(
            'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          data-command-input=""
          {...props}
        />
      </div>
    );
  }
);

CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<HTMLDivElement, ListBoxProps<object>>(
  ({ className, ...props }, ref) => (
    <ListBox
      ref={ref}
      aria-label="Command options"
      selectionMode="single"
      shouldFocusWrap
      disallowEmptySelection
      data-command-list=""
      className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden outline-none', className)}
      {...props}
    />
  )
);

CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { visibleCount } = useCommandContext();
    if (visibleCount !== 0) return null;

    return (
      <div ref={ref} className={cn('py-6 text-center text-sm', className)} data-command-empty="" {...props} />
    );
  }
);

CommandEmpty.displayName = 'CommandEmpty';

type CommandGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  heading?: React.ReactNode;
};

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div
      ref={ref}
      data-command-group=""
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[data-command-group-label]]:px-2 [&_[data-command-group-label]]:py-1.5 [&_[data-command-group-label]]:text-xs [&_[data-command-group-label]]:font-medium [&_[data-command-group-label]]:text-muted-foreground',
        className
      )}
      {...props}
    >
      {heading ? (
        <p data-command-group-label="" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </p>
      ) : null}
      <div>{children}</div>
    </div>
  )
);

CommandGroup.displayName = 'CommandGroup';

const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn('-mx-1 h-px bg-border', className)} {...props} />
  )
);
CommandSeparator.displayName = 'CommandSeparator';

type CommandItemProps = Omit<ListBoxItemProps<object>, 'id' | 'children'> & {
  value?: string;
  keywords?: string[];
  onSelect?: (value: string) => void;
  children: React.ReactNode;
};

const getTextContent = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join(' ');
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextContent(node.props?.children);
  }
  return '';
};

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({
    className,
    value,
    keywords = [],
    children,
    onSelect,
    isDisabled,
    textValue,
    ...props
  }, ref) => {
    const { query, filterText, registerVisibility, unregisterVisibility } = useCommandContext();
    const generatedId = React.useId();
    const itemId = value ?? generatedId;

    const computedText = React.useMemo(() => {
      if (textValue != null) return textValue;
      const content = getTextContent(children);
      if (content) return content;
      return String(value ?? '');
    }, [children, textValue, value]);
    const haystack = React.useMemo(() => {
      return [computedText, ...(keywords ?? [])].filter(Boolean) as string[];
    }, [computedText, keywords]);

    const matchesQuery = React.useMemo(() => {
      if (!query) return true;
      return haystack.some((entry) => filterText(entry, query));
    }, [filterText, haystack, query]);

    React.useEffect(() => {
      registerVisibility(itemId, !isDisabled && matchesQuery);
      return () => unregisterVisibility(itemId);
    }, [isDisabled, itemId, matchesQuery, registerVisibility, unregisterVisibility]);

    if (!matchesQuery) {
      return null;
    }

    return (
      <ListBoxItem
        id={itemId}
        textValue={computedText}
        ref={ref}
        data-command-item=""
        className={({ isFocused, isDisabled: optionDisabled }) =>
          cn(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none',
            optionDisabled && 'opacity-50',
            isFocused && 'bg-accent text-accent-foreground',
            className
          )}
        isDisabled={isDisabled}
        onAction={() => onSelect?.(itemId)}
        {...props}
      >
        {children}
      </ListBoxItem>
    );
  }
);

CommandItem.displayName = 'CommandItem';

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className
      )}
      data-command-shortcut=""
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
