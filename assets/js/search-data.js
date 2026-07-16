// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "Home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-about",
          title: "About",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/about/";
          },
        },{id: "nav-research",
          title: "Research",
          description: "Papers, active topics, and selected projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Complete bibliography in reverse chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-recruiting",
          title: "Recruiting",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/recruiting/";
          },
        },{id: "nav-tools",
          title: "Tools",
          description: "Open-source software and research code.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/code/";
          },
        },{id: "nav-links",
          title: "Links",
          description: "Things I found interesting.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/links/";
          },
        },{id: "news-new-arxiv-preprint-sub-nm-curvature-unlocks-quantum-flexoelectricity-in-graphene",
          title: 'New arXiv preprint — Sub-nm Curvature Unlocks Quantum Flexoelectricity in Graphene',
          description: "",
          section: "News",},{id: "news-new-paper-in-nano-letters-gate-tunable-band-edge-in-few-layer-mos2",
          title: 'New paper in Nano Letters — Gate-Tunable Band Edge in Few-Layer MoS2',
          description: "",
          section: "News",},{id: "news-new-paper-in-acs-nano-atomic-imaging-of-2d-transition-metal-diiodides",
          title: 'New paper in ACS Nano — Atomic Imaging of 2D Transition Metal Diiodides...',
          description: "",
          section: "News",},{id: "news-phd-position-available-multi-modal-ai-models-for-designer-ferroelectric-devices",
          title: 'PhD position available — Multi-modal AI models for designer ferroelectric devices',
          description: "",
          section: "News",},{id: "news-new-preprint-on-arxiv-charge-distribution-across-dislocation-networks-in-hbn-substrates",
          title: 'New preprint on arXiv — Charge distribution across dislocation networks in hBN substrates...',
          description: "",
          section: "News",},{id: "news-new-paper-in-science-atomic-resolution-imaging-of-gold-species-at-organic-liquid-solid-interfaces",
          title: 'New paper in Science — Atomic-resolution imaging of gold species at organic liquid-solid...',
          description: "",
          section: "News",},{id: "news-new-paper-in-nano-letters-refined-dft-recipe-for-spin-orbit-splitting-in-monolayer-mos2",
          title: 'New paper in Nano Letters — Refined DFT recipe for spin-orbit splitting in...',
          description: "",
          section: "News",},{id: "news-phd-position-available-neural-quantum-states-for-automated-discovery-of-emergent-quantum-phases-in-two-dimensional-materials",
          title: 'PhD position available — Neural Quantum States for Automated Discovery of Emergent Quantum...',
          description: "",
          section: "News",},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%61%6D%65%73.%6D%63%68%75%67%68@%6D%61%6E%63%68%65%73%74%65%72.%61%63.%75%6B", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/jgmcm", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0001-8509-4883", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=NMv2z6UAAAAJ", "_blank");
        },
      },];
