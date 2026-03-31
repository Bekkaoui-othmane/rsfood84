import React from 'react';

export default function GoogleMap() {
  return (
    <div className="w-full h-[400px] overflow-hidden rounded-2xl border border-[var(--border-color)]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2871.4938634861623!2d4.9213568!3d43.9288126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b5ebfdf2592737%3A0xe3eacaef242e20ac!2s80%20Rue%20de%20la%20Paix%2C%2084310%20Mori%C3%A8res-l%C3%A8s-Avignon!5e0!3m2!1sfr!2sfr!4v1703000000000!5m2!1sfr!2sfr"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Carte Google Maps affichant l'adresse de Rs Food84"
      ></iframe>
    </div>
  );
}
