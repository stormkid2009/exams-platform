import React from "react";
import CopyRights from "./copy-rights";
/**
 * Footer Component
 * 
 * This component renders the footer section of the application, 
 * which includes copyright information displayed by the CopyRights component.
 */
function Footer() {
  return (
    <footer className="w-full rounded-b-lg bg-slate-700 text-white py-4">
      <CopyRights className="p-4" />
    </footer>
  );
}

export default Footer;
