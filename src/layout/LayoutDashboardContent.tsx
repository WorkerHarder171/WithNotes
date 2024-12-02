interface LayoutDashboardContentProps
  extends React.HtmlHTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function LayoutDashboardContent({
  children,
  ...props
}: LayoutDashboardContentProps): JSX.Element {
  return (
    <section className="w-[60%] mx-auto" {...props}>
      {children}
    </section>
  );
}
