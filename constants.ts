// Fix: Created initial mock data for products and site configuration.
import { Product, SiteData } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cover "Marmo Cosmico"',
    description: 'Proteggi il tuo smartphone con stile. Questa cover presenta un design unico ispirato alle venature del marmo cosmico, offrendo una protezione robusta e un look elegante.',
    deliveryInfo: 'Spedizione gratuita in 24/48 ore in tutta Italia. Il tuo ordine verrà elaborato entro un giorno lavorativo e riceverai un codice di tracciamento via email non appena sarà spedito.',
    warrantyInfo: 'Offriamo una garanzia "Soddisfatti o Rimborsati" di 30 giorni. Se per qualsiasi motivo non sei soddisfatto del tuo acquisto, puoi restituirlo per un rimborso completo. Inoltre, il prodotto è coperto da una garanzia di 2 anni contro i difetti di fabbricazione.',
    manualInfo: 'Per applicare la cover, pulisci accuratamente il tuo smartphone. Inserisci prima un lato del telefono nella cover e poi premi delicatamente sugli angoli opposti fino a quando non scatta in posizione. Per la pulizia, usa un panno umido e sapone neutro.',
    price: 19.99,
    // FIX: Added missing 'currency' property to conform to the Product type.
    currency: 'EUR',
    originalPrice: 24.99,
    imageUrls: ['/images/product-1.jpg', '/images/product-1-alt.jpg'],
    reviews: [
      {
        id: 'rev1',
        customerName: 'Laura Bianchi',
        customerImageUrl: '/images/customer-1.jpg',
        showCustomerImage: true,
        date: '2024-05-15',
        rating: 5,
        title: 'Semplicemente stupenda!',
        text: 'La cover è ancora più bella dal vivo. I colori sono brillanti e il materiale sembra molto resistente. Spedizione velocissima!',
        mediaUrl: '/images/review-1.jpg',
        mediaType: 'image',
      },
      {
        id: 'rev2',
        customerName: 'Marco Rossi',
        showCustomerImage: false,
        date: '2024-05-12',
        rating: 5,
        title: 'Ottimo acquisto',
        text: 'Protegge bene il telefono e il design è unico. Ho ricevuto un sacco di complimenti. Consigliatissima.',
      },
      {
        id: 'rev3',
        customerName: 'Giulia Conti',
        customerImageUrl: '/images/customer-2.jpg',
        showCustomerImage: true,
        date: '2024-05-20',
        rating: 4,
        title: 'Molto bella ma...',
        text: "La cover è bellissima e calza a pennello. Avrei dato 5 stelle se i bordi fossero stati un po' più rialzati per proteggere meglio lo schermo.",
        mediaUrl: '/videos/review-video-1.mp4',
        mediaType: 'video',
      }
    ],
    details: [
      'Materiale: Silicone TPU flessibile e resistente',
      'Compatibile con ricarica wireless',
      'Bordi rialzati per protezione schermo e fotocamera',
      'Stampa di alta qualità che non sbiadisce'
    ],
    availability: 'Disponibile',
    hasQuantityVariations: true,
    quantityVariations: [
        { quantity: 1, price: 19.99, badge: '' },
        { quantity: 2, price: 34.99, badge: 'RISPARMI 12%' },
        { quantity: 3, price: 49.99, badge: 'PIÙ VENDUTO' }
    ],
    checkoutFormHtml: ``,
    checkoutFormCss: '',
    isFeatured: true,
    // FIX: Added missing 'categoryId' property to conform to the Product type.
    categoryId: null,
    facebookPixelHtml: '',
    tiktokPixelHtml: '',
    scarcity: {
        enabled: false,
        text: 'Attenzione: scorte in esaurimento!',
        initialStock: 50,
        currentStock: 10,
    },
    // FIX: Added missing 'visibleInConfigIds' property to conform to the Product type.
    visibleInConfigIds: [],
  },
  {
    id: '2',
    name: 'Cover "Onda Notturna"',
    description: 'Ispirata alla tranquillità di una notte stellata sul mare, questa cover unisce arte e protezione. Realizzata con materiali premium per resistere agli urti.',
    deliveryInfo: 'Consegna standard in 3-5 giorni lavorativi. Opzione di spedizione express disponibile al checkout. Tracciamento completo incluso per tutti gli ordini.',
    warrantyInfo: 'Garanzia di 2 anni contro difetti di conformità. Reso facile entro 14 giorni dalla consegna. Contatta il nostro servizio clienti per qualsiasi problema.',
    manualInfo: 'Facile da installare e rimuovere. Per la pulizia, si consiglia di utilizzare un panno morbido leggermente inumidito. Evitare solventi chimici aggressivi che potrebbero danneggiare la finitura opaca.',
    price: 22.50,
    // FIX: Added missing 'currency' property to conform to the Product type.
    currency: 'EUR',
    imageUrls: ['/images/product-2.jpg', '/images/product-2-alt.jpg'],
    reviews: [],
    details: [
      'Doppio strato: guscio rigido in policarbonato e interno in TPU',
      'Finitura opaca anti-impronta',
      'Accesso preciso a tutte le porte e pulsanti',
      'Design sottile e leggero'
    ],
    availability: 'Disponibile',
    hasQuantityVariations: false,
    quantityVariations: [],
    checkoutFormHtml: '',
    checkoutFormCss: '',
    isFeatured: true,
    // FIX: Added missing 'categoryId' property to conform to the Product type.
    categoryId: null,
    facebookPixelHtml: '',
    tiktokPixelHtml: '',
    scarcity: {
        enabled: false,
        text: 'Attenzione: scorte in esaurimento!',
        initialStock: 50,
        currentStock: 10,
    },
    // FIX: Added missing 'visibleInConfigIds' property to conform to the Product type.
    visibleInConfigIds: [],
  },
  {
    id: '3',
    name: 'Cover "Legno Naturale"',
    description: 'Porta un tocco di natura con te. Ogni cover è unica, con vere venature del legno incastonate in un bumper protettivo. Eleganza e sostenibilità.',
    deliveryInfo: 'Spedizione ecologica con imballaggi riciclati in 3-5 giorni. Contribuisci a un pianeta più verde con il tuo acquisto.',
    warrantyInfo: 'Ogni cover in legno è unica e coperta da una garanzia di 1 anno su eventuali difetti del legno o del bumper. La nostra politica di reso di 30 giorni si applica anche a questo prodotto.',
    manualInfo: 'Essendo un prodotto naturale, il legno può variare leggermente nel colore e nelle venature. Per mantenere la sua bellezza, evitare l\'esposizione prolungata alla luce solare diretta e all\'umidità. Pulire con un panno asciutto.',
    price: 29.99,
    // FIX: Added missing 'currency' property to conform to the Product type.
    currency: 'EUR',
    imageUrls: ['/images/product-3.jpg', '/images/product-3-alt.jpg'],
    reviews: [],
    details: [
      'Vero inserto in legno di ciliegio',
      'Bumper in policarbonato anti-urto',
      'Grip laterale migliorato',
      'Sottile e non ingombrante'
    ],
    availability: 'Disponibile',
    hasQuantityVariations: false,
    quantityVariations: [],
    checkoutFormHtml: '',
    checkoutFormCss: '',
    isFeatured: true,
    // FIX: Added missing 'categoryId' property to conform to the Product type.
    categoryId: null,
    facebookPixelHtml: '',
    tiktokPixelHtml: '',
    scarcity: {
        enabled: false,
        text: 'Attenzione: scorte in esaurimento!',
        initialStock: 50,
        currentStock: 10,
    },
    // FIX: Added missing 'visibleInConfigIds' property to conform to the Product type.
    visibleInConfigIds: [],
  },
  {
    id: '4',
    name: 'Cover Trasparente "Crystal"',
    description: "Mostra il design originale del tuo telefono senza compromettere la protezione. La nostra cover Crystal è ultra-trasparente e resistente all'ingiallimento.",
    deliveryInfo: 'Spedizione rapida in 24/48 ore. Ordina prima delle 12:00 per una spedizione in giornata.',
    warrantyInfo: 'Garanzia a vita contro l\'ingiallimento. Se la tua cover dovesse ingiallire, te ne spediremo una nuova gratuitamente. Si applica la politica di reso standard di 30 giorni.',
    manualInfo: 'Per mantenere la massima trasparenza, pulire regolarmente la cover con acqua e sapone. Assicurarsi che sia completamente asciutta prima di riapplicarla al telefono. Evitare il contatto con inchiostro o coloranti.',
    price: 15.00,
    // FIX: Added missing 'currency' property to conform to the Product type.
    currency: 'EUR',
    originalPrice: 19.99,
    imageUrls: ['/images/product-4.jpg', '/images/product-4-alt.jpg'],
    reviews: [],
    details: [
      'Materiale flessibile e trasparente',
      'Tecnologia anti-ingiallimento',
      'Angoli rinforzati con Air-Cushion',
      'Compatibile con tutte le protezioni per lo schermo'
    ],
    availability: 'Disponibile',
    hasQuantityVariations: false,
    quantityVariations: [],
    checkoutFormHtml: '',
    checkoutFormCss: '',
    isFeatured: true,
    // FIX: Added missing 'categoryId' property to conform to the Product type.
    categoryId: null,
    facebookPixelHtml: '',
    tiktokPixelHtml: '',
    scarcity: {
        enabled: false,
        text: 'Attenzione: scorte in esaurimento!',
        initialStock: 50,
        currentStock: 10,
    },
    // FIX: Added missing 'visibleInConfigIds' property to conform to the Product type.
    visibleInConfigIds: [],
  },
    {
    id: '5',
    name: 'Cover "Pelle Vegana"',
    description: 'Lusso e coscienza si incontrano in questa cover in pelle vegana di alta qualità. Morbida al tatto, offre un look sofisticato e una protezione affidabile.',
    deliveryInfo: 'Spedizione standard gratuita (3-5 giorni). Ogni cover viene spedita in un\'elegante confezione regalo.',
    warrantyInfo: 'Garanzia di 2 anni sulla durabilità della pelle vegana e sulle cuciture. La nostra garanzia "Soddisfatti o Rimborsati" è estesa a 60 giorni per questo prodotto premium.',
    manualInfo: 'Pulire delicatamente con un panno umido. Non usare prodotti per la cura della pelle vera. La texture potrebbe leggermente cambiare con l\'uso, acquisendo un carattere unico nel tempo.',
    price: 27.90,
    // FIX: Added missing 'currency' property to conform to the Product type.
    currency: 'EUR',
    imageUrls: ['/images/product-5.jpg', '/images/product-5-alt.jpg'],
    reviews: [],
    details: [
      'Pelle PU premium',
      'Fodera interna in microfibra',
      'Design slim-fit',
      'Disponibile in vari colori classici'
    ],
    availability: 'Disponibile',
    hasQuantityVariations: false,
    quantityVariations: [],
    checkoutFormHtml: '',
    checkoutFormCss: '',
    isFeatured: false,
    // FIX: Added missing 'categoryId' property to conform to the Product type.
    categoryId: null,
    facebookPixelHtml: '',
    tiktokPixelHtml: '',
    scarcity: {
        enabled: false,
        text: 'Attenzione: scorte in esaurimento!',
        initialStock: 50,
        currentStock: 10,
    },
    // FIX: Added missing 'visibleInConfigIds' property to conform to the Product type.
    visibleInConfigIds: [],
  },
  {
    id: '6',
    name: 'Cover "Gradient Sunset"',
    description: 'Cattura la magia di un tramonto con questa cover dal design sfumato. I colori vivaci e la protezione robusta rendono il tuo telefono un vero e proprio accessorio di moda.',
    deliveryInfo: 'Consegna veloce in 1-3 giorni lavorativi. Spediamo con corriere espresso per garantire che i colori vivaci arrivino da te il prima possibile.',
    warrantyInfo: 'Garanzia di 1 anno sulla stampa del gradiente e sul vetro temperato. Se il retro si graffia o la stampa sbiadisce in modo anomalo, contattaci per una sostituzione.',
    manualInfo: 'Il retro in vetro temperato offre un\'ottima sensazione al tatto ma richiede attenzione. Evitare cadute su superfici dure. Pulire con un panno per occhiali per mantenere la brillantezza dei colori.',
    price: 21.99,
    // FIX: Added missing 'currency' property to conform to the Product type.
    currency: 'EUR',
    imageUrls: ['/images/product-6.jpg', '/images/product-6-alt.jpg'],
    reviews: [],
    details: [
      'Retro in vetro temperato 9H',
      'Bumper in silicone morbido',
      'Protezione completa a 360 gradi',
      'Colori sfumati vibranti'
    ],
    availability: 'Disponibile',
    hasQuantityVariations: false,
    quantityVariations: [],
    checkoutFormHtml: '',
    checkoutFormCss: '',
    isFeatured: false,
    // FIX: Added missing 'categoryId' property to conform to the Product type.
    categoryId: null,
    facebookPixelHtml: '',
    tiktokPixelHtml: '',
    scarcity: {
        enabled: false,
        text: 'Attenzione: scorte in esaurimento!',
        initialStock: 50,
        currentStock: 10,
    },
    // FIX: Added missing 'visibleInConfigIds' property to conform to the Product type.
    visibleInConfigIds: [],
  }
];

export const INITIAL_SITE_DATA: SiteData = {
  siteName: {
    main: 'HUSITON',
    highlight: 'GADGET'
  },
  theme: {
    primaryColor: '#FFA500', // mango-orange
    darkColor: '#333333' // mango-dark
  },
  hero: {
    title: 'Stile e Protezione Unici',
    subtitle: 'Scopri la nostra collezione di cover per smartphone, create per chi non si accontenta.',
    imageUrl: '/images/hero-banner.jpg'
  },
  valueProps: [
    { icon: 'Truck', title: 'Spedizione Veloce', description: 'Consegna rapida e affidabile in tutta Italia.' },
    { icon: 'ShieldCheck', title: 'Pagamenti Sicuri', description: 'Transazioni protette con i migliori standard di sicurezza.' },
    { icon: 'ChatBubble', title: 'Supporto Clienti', description: 'Il nostro team è sempre a tua disposizione per aiutarti.' }
  ],
  featuredProductsTitle: 'I Nostri Bestseller',
  promoBanner: {
    enabled: true,
    imageUrl: '/images/promo-banner.jpg',
    title: 'SCONTO DEL 20%!',
    subtitle: 'Usa il codice PROMO20 al checkout per ottenere uno sconto su tutti i nostri prodotti. Offerta a tempo limitato!',
    buttonText: 'Acquista Ora',
    buttonLink: 'shop'
  },
  newsletter: {
    title: 'Rimani Aggiornato',
    description: 'Iscriviti alla nostra newsletter per ricevere sconti esclusivi e anteprime sui nuovi arrivi.'
  },
  about: {
      paragraphs: [
          'Benvenuti in HUSITON GADGET, la vostra destinazione per accessori per smartphone che combinano design, qualità e funzionalità. Nati dalla passione per la tecnologia e lo stile, ci impegniamo a offrire prodotti unici che non solo proteggono i vostri dispositivi, ma ne esaltano anche l\'estetica.',
          'La nostra missione è semplice: fornire cover e gadget innovativi, realizzati con materiali di alta qualità e con un\'attenzione meticolosa ai dettagli. Ogni prodotto nel nostro catalogo è stato selezionato e testato per garantire la massima soddisfazione del cliente.',
          'Crediamo che un accessorio non sia solo un oggetto, ma un\'estensione della propria personalità. Per questo, la nostra collezione è in continua evoluzione, alla ricerca costante di nuove tendenze e soluzioni creative per soddisfare ogni gusto ed esigenza. Grazie per aver scelto HUSITON GADGET.'
      ]
  },
  faq: {
      items: [
          {
              question: 'Quali sono i tempi di spedizione?',
              answer: 'Generalmente, la spedizione richiede 3-5 giorni lavorativi in tutta Italia. Riceverai un\'email di conferma con il codice di tracciamento non appena il tuo ordine verrà spedito.'
          },
          {
              question: 'È possibile effettuare un reso?',
              answer: 'Certo. Hai 14 giorni di tempo dalla data di ricezione del prodotto per effettuare un reso. Il prodotto deve essere nelle sue condizioni originali. Contatta il nostro supporto clienti per avviare la procedura.'
          },
          {
              question: 'Quali metodi di pagamento accettate?',
              answer: 'Accettiamo le principali carte di credito (Visa, MasterCard, American Express), PayPal e altri metodi di pagamento sicuri. Tutte le transazioni sono crittografate per la tua sicurezza.'
          },
      ]
  },
  thankYouPage: {
      title: 'Grazie per il tuo ordine!',
      message: 'Il tuo ordine è stato ricevuto correttamente. Verrai ricontattato telefonicamente da un nostro operatore per confermare l\'ordine e per poter procedere con la spedizione.',
      facebookPixelHtml: '',
      tiktokPixelHtml: '',
  },
  homePageProductTakeoverId: '',
  tracking: {
    facebookPixelHtml: '',
    tiktokPixelHtml: '',
  },
  defaultWebhookUrl: '',
  defaultCheckoutFormHtml: `
      <div class="space-y-4 text-left">
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">Nome e Cognome</label>
          <input type="text" id="fullName" name="fullName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder="Mario Rossi">
        </div>
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">Indirizzo Completo (Via, Numero, CAP, Città)</label>
          <input type="text" id="address" name="address" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder="Via Roma 1, 00100 Roma (RM)">
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700">Numero di Telefono (per il corriere)</label>
          <input type="tel" id="phone" name="phone" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder="3331234567">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email (facoltativa)</label>
          <input type="email" id="email" name="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mango-orange focus:border-mango-orange sm:text-sm" placeholder="mario.rossi@email.com">
        </div>
      </div>
    `,
};