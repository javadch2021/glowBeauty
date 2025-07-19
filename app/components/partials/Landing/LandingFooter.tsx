export default function LandingFooter() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} GlowBeauty. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
