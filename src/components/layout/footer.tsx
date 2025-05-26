export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-8 border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} نیلوفر بوتیک. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
