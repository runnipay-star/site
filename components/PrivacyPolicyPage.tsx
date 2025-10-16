import React from 'react';

interface PrivacyPolicyPageProps {
    siteName: {
        main: string;
        highlight: string;
    }
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ siteName }) => {
    const fullSiteName = `${siteName.main} ${siteName.highlight}`;
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-mango-dark">Privacy Policy</h1>
        <div className="space-y-6 text-gray-700 prose lg:prose-lg">
          <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}</p>

          <p>
            Benvenuto su {fullSiteName}. La tua privacy è molto importante per noi. Questa Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo le tue informazioni personali quando visiti il nostro sito web.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">1. Titolare del Trattamento</h2>
          <p>
            {fullSiteName} opera come intermediario e affiliato. I dati personali forniti dall'utente attraverso i moduli di contatto o di ordine vengono trasmessi direttamente all'azienda fornitrice del prodotto, che agisce come Titolare del Trattamento autonomo per la gestione dell'ordine, la spedizione e le finalità correlate.
          </p>
          <p>Per domande relative a questa policy, puoi contattarci a: <a href={`mailto:info@${siteName.main.toLowerCase()}${siteName.highlight.toLowerCase()}.com`} className="text-mango-orange hover:underline">{`info@${siteName.main.toLowerCase()}${siteName.highlight.toLowerCase()}.com`}</a>.</p>

          <h2 className="text-2xl font-bold text-mango-dark">2. Dati Personali Raccolti</h2>
          <p>Raccogliamo i seguenti tipi di informazioni:</p>
          <ul>
            <li>
              <strong>Dati forniti volontariamente:</strong> Quando compili un modulo per effettuare un ordine, raccogliamo i dati necessari per elaborare la tua richiesta, come nome, cognome, indirizzo di spedizione, numero di telefono e indirizzo email. Questi dati vengono inoltrati all'azienda fornitrice.
            </li>
            <li>
              <strong>Dati di navigazione:</strong> Come molti siti web, raccogliamo informazioni che il tuo browser invia ogni volta che visiti il nostro sito. Questi dati possono includere l'indirizzo IP del tuo computer, il tipo di browser, la versione del browser, le pagine del nostro sito che visiti, l'ora e la data della tua visita e altre statistiche.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-mango-dark">3. Finalità del Trattamento</h2>
          <p>Utilizziamo le tue informazioni personali per le seguenti finalità:</p>
          <ul>
            <li>Per trasmettere la tua richiesta di ordine all'azienda fornitrice che si occuperà della vendita e della spedizione del prodotto.</li>
            <li>Per migliorare e ottimizzare il nostro sito web e la tua esperienza di navigazione.</li>
            <li>Per adempiere agli obblighi legali e normativi.</li>
          </ul>

          <h2 className="text-2xl font-bold text-mango-dark">4. Condivisione dei Dati</h2>
          <p>
            I tuoi dati personali inseriti nei moduli d'ordine non vengono conservati da noi, ma vengono trasmessi in modo sicuro all'azienda fornitrice del prodotto che hai scelto. Non vendiamo, scambiamo o trasferiamo in altro modo a terzi le tue informazioni personali, ad eccezione dei partner di fiducia che ci assistono nella gestione del nostro sito web o che gestiscono gli ordini, a condizione che tali parti si impegnino a mantenere riservate tali informazioni.
          </p>
          
          <h2 className="text-2xl font-bold text-mango-dark">5. Cookie</h2>
          <p>
            Il nostro sito utilizza i cookie per migliorare la tua esperienza di navigazione. Per maggiori dettagli, ti invitiamo a consultare la nostra <a href="#" onClick={(e) => { e.preventDefault(); (window as any).app.setView('cookiePolicy'); }} className="text-mango-orange hover:underline">Cookie Policy</a>.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">6. I Tuoi Diritti</h2>
          <p>
            In conformità con il GDPR, hai il diritto di accedere, rettificare, cancellare, limitare il trattamento dei tuoi dati personali, nonché il diritto alla portabilità dei dati. Poiché non conserviamo i dati degli ordini, per esercitare questi diritti sui dati relativi al tuo acquisto, dovrai contattare direttamente l'azienda fornitrice.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">7. Modifiche a questa Privacy Policy</h2>
          <p>
            Ci riserviamo il diritto di aggiornare questa Privacy Policy in qualsiasi momento. Qualsiasi modifica sarà pubblicata su questa pagina. Ti invitiamo a controllare periodicamente questa pagina per eventuali aggiornamenti.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;