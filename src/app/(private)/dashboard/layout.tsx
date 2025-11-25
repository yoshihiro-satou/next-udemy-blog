import PrivateHeader from "@/components/layouts/PrivateHeader";

export default function PrivateLayput({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PrivateHeader />
      {children}
    </>
  )
}
