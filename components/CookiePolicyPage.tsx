import React from 'react';

const CookiePolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-mango-dark">Cookie Policy</h1>
        <div className="space-y-6 text-gray-700 prose lg:prose-lg">
          <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}</p>

          <h2 className="text-2xl font-bold text-mango-dark">1. Cosa sono i Cookie?</h2>
          <p>
            I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro terminali (solitamente al browser), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente. Servono a eseguire autenticazioni informatiche, monitoraggio di sessioni e memorizzazione di informazioni specifiche riguardanti gli utenti che accedono al server.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">2. Tipologie di Cookie Utilizzati</h2>
          <p>Questo sito utilizza le seguenti tipologie di cookie:</p>
          <ul>
            <li>
              <strong>Cookie Tecnici:</strong> Sono essenziali per il corretto funzionamento del sito. Questi cookie non richiedono il consenso preventivo dell'utente per essere installati ed utilizzati.
            </li>
            <li>
              <strong>Cookie Analitici:</strong> Utilizziamo questi cookie per raccogliere informazioni in forma aggregata e anonima sul numero di utenti e su come questi visitano il sito stesso. Le informazioni generate sono utilizzate per monitorare le prestazioni del sito e migliorarne il contenuto.
            </li>
            <li>
              <strong>Cookie di Terze Parti e di Marketing:</strong> Per le nostre campagne pubblicitarie, utilizziamo strumenti di tracciamento forniti da terze parti, come Facebook (Meta) Pixel e TikTok Pixel. Questi cookie ci aiutano a misurare l'efficacia delle nostre inserzioni pubblicitarie e a mostrare annunci pertinenti agli utenti che hanno visitato il nostro sito.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-mango-dark">Elenco delle Terze Parti</h3>
          <ul>
            <li><strong>Facebook (Meta):</strong> Per maggiori informazioni, visita la <a href="https://www.facebook.com/policy/cookies/" target="_blank" rel="noopener noreferrer" className="text-mango-orange hover:underline">policy sui cookie di Facebook</a>.</li>
            <li><strong>TikTok:</strong> Per maggiori informazioni, visita la <a href="https://www.tiktok.com/legal/cookie-policy" target="_blank" rel="noopener noreferrer" className="text-mango-orange hover:underline">policy sui cookie di TikTok</a>.</li>
          </ul>

          <h2 className="text-2xl font-bold text-mango-dark">3. Come Gestire i Cookie</h2>
          <p>
            L'utente può decidere se accettare o meno i cookie utilizzando le impostazioni del proprio browser. La disabilitazione totale o parziale dei cookie tecnici può compromettere l'utilizzo delle funzionalità del sito.
          </p>
          <p>
            Puoi gestire le preferenze relative ai cookie direttamente all'interno del tuo browser per impedire, ad esempio, che terze parti possano installarne. Di seguito i link alle istruzioni per i browser più comuni:
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-mango-orange hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer" className="text-mango-orange hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-mango-orange hover:underline">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/it-it/windows/eliminare-e-gestire-i-cookie-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-mango-orange hover:underline">Microsoft Edge</a></li>
          </ul>

          <h2 className="text-2xl font-bold text-mango-dark">4. Consenso</h2>
          <p>
            Continuando la navigazione su questo sito, chiudendo il banner informativo o cliccando in una qualsiasi parte della pagina, si accetta la nostra Cookie Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;