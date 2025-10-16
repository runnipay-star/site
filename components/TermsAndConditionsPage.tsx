import React from 'react';

interface TermsAndConditionsPageProps {
    siteName: {
        main: string;
        highlight: string;
    }
}

const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ siteName }) => {
  const fullSiteName = `${siteName.main} ${siteName.highlight}`;
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-mango-dark">Termini e Condizioni</h1>
        <div className="space-y-6 text-gray-700 prose lg:prose-lg">
          <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}</p>

          <p>
            I presenti Termini e Condizioni regolano l'utilizzo del sito web {fullSiteName}. Accedendo a questo sito, l'utente accetta di essere vincolato da questi termini. Se non si è d'accordo con una qualsiasi parte dei termini, non è possibile utilizzare il nostro sito.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">1. Ruolo di Affiliato e Limitazione di Responsabilità</h2>
          <p>
            È fondamentale comprendere che <strong>{fullSiteName} agisce esclusivamente come affiliato</strong> e si concentra sulla promozione di prodotti tramite campagne pubblicitarie. Il nostro ruolo è quello di intermediario tra l'utente e l'azienda fornitrice finale del prodotto.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Nessuna Responsabilità sui Prodotti:</strong> Non ci assumiamo alcuna responsabilità per la spedizione, la qualità, la conformità, la garanzia o qualsiasi altra questione riguardante i prodotti venduti tramite i nostri link di affiliazione. Qualsiasi problematica relativa a spedizioni, qualità o difetti del prodotto ricade direttamente ed esclusivamente sulla responsabilità dell'azienda fornitrice.
            </li>
            <li>
              <strong>Immagini a Scopo Illustrativo:</strong> Le immagini utilizzate sul nostro sito a scopo illustrativo potrebbero non corrispondere esattamente all'aspetto reale del prodotto acquistato.
            </li>
            <li>
              <strong>Contatto con l'Assistenza Clienti:</strong> Invitiamo caldamente l'utente a contattare il servizio assistenza clienti dell'azienda fornitrice dopo aver inserito i dati nel modulo d'ordine, ma prima di confermare definitivamente l'acquisto, per porre qualsiasi domanda o richiedere informazioni sul prodotto.
            </li>
            <li>
              <strong>Prodotti in Omaggio:</strong> Eventuali prodotti in omaggio proposti sul sito sono soggetti a disponibilità limitata. Non vi è alcuna garanzia di disponibilità da parte del venditore che spedisce il prodotto.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-mango-dark">2. Processo di Acquisto</h2>
          <p>
            Quando un utente decide di acquistare un prodotto promosso su {fullSiteName}, viene invitato a compilare un modulo con i propri dati. Tali dati vengono trasmessi direttamente all'azienda fornitrice, che gestirà l'intero processo di vendita, pagamento, spedizione e assistenza post-vendita. {fullSiteName} non è parte del contratto di vendita tra l'utente e l'azienda fornitrice.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">3. Proprietà Intellettuale</h2>
          <p>
            Il contenuto di questo sito, inclusi testi, grafica, loghi e immagini, è di proprietà di {fullSiteName} o dei suoi fornitori di contenuti ed è protetto dalle leggi sul diritto d'autore.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">4. Modifiche ai Termini</h2>
          <p>
            Ci riserviamo il diritto di modificare questi Termini e Condizioni in qualsiasi momento. Le modifiche entreranno in vigore immediatamente dopo la loro pubblicazione sul sito. L'uso continuato del sito dopo tali modifiche costituirà il riconoscimento e l'accettazione dei termini modificati.
          </p>
          
          <h2 className="text-2xl font-bold text-mango-dark">5. Legge Applicabile</h2>
          <p>
            Questi Termini e Condizioni sono regolati e interpretati in conformità con le leggi dello Stato Italiano.
          </p>

          <h2 className="text-2xl font-bold text-mango-dark">6. Contatti</h2>
          <p>
            Per qualsiasi domanda relativa a questi Termini, si prega di contattarci a <a href={`mailto:info@${siteName.main.toLowerCase()}${siteName.highlight.toLowerCase()}.com`} className="text-mango-orange hover:underline">{`info@${siteName.main.toLowerCase()}${siteName.highlight.toLowerCase()}.com`}</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;