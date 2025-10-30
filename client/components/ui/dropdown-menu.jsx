import * as React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild, ...props }) => {
  const handleClick = () => setIsOpen(!isOpen);

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

const DropdownMenuContent = ({ children, isOpen, setIsOpen, className, align = "start", ...props }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignmentClass = align === "end" ? "right-0" : "left-0";

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 mt-1",
        alignmentClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, isOpen, setIsOpen, className, ...props }) => {
  const handleClick = () => {
    onClick?.();
    setIsOpen?.(false);
  };

  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = ({ className, ...props }) => (
  <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
);

const DropdownMenuLabel = ({ children, className, ...props }) => (
  <div
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuSub = ({ children }) => {
  const [isSubOpen, setIsSubOpen] = React.useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsSubOpen(true)}
      onMouseLeave={() => setIsSubOpen(false)}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isSubOpen, setIsSubOpen })
      )}
    </div>
  );
};

const DropdownMenuSubTrigger = ({ children, isSubOpen, className, ...props }) => (
  <div
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuSubContent = ({ children, isSubOpen, className, ...props }) => {
  if (!isSubOpen) return null;

  return (
    <div
      className={cn(
        "absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 ml-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
