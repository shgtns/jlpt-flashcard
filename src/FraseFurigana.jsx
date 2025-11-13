import React from "react";
import DOMPurify from "dompurify";

/**
 * FraseFurigana
 * - html: stringa HTML contenente markup <ruby> già generato (o testo normale)
 * Ritorna un elemento che rende l'HTML sanitizzato con dangerouslySetInnerHTML.
 */
export default function FraseFurigana({ html = "" }) {
  const clean = DOMPurify.sanitize(String(html));
  return <span className="nihongo" dangerouslySetInnerHTML={{ __html: clean }} />;
}