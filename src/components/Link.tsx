import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  children: ReactNode;
};

/**
 * Single link primitive used across the homepage. Swap the implementation
 * here (e.g. to TanStack Router) without touching any section.
 */
export const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ to, children, ...rest }, ref) {
  const external = /^(https?:)?\/\//.test(to) || to.startsWith("mailto:");
  if (external || to === "#") {
    return (
      <a ref={ref} href={to} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink ref={ref} to={to} {...rest}>
      {children}
    </RouterLink>
  );
});
