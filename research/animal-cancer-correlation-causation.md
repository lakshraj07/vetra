# Animal cancers for correlation and causation studies

What this covers: which cancers in pets and livestock work best for correlation and causation research, which pathology and lab databases hold the data, and what that means for Vetra.

---

## 1. What makes a cancer useful for this kind of study

A cancer is a strong candidate when it has:

1. **A testable exposure or mechanism.** Examples are a chemical, a virus, UV light, a vaccine, or hormone status. A cancer with no known exposure only supports description.
2. **Clear diagnosis by histopathology or cytology,** so lab reports can be coded the same way across labs.
3. **Enough cases.** It needs to be common, or common within particular breeds.
4. **Built-in variation.** Breed differences, neuter status, geography, or indoor vs outdoor living give you natural comparison groups.
5. **A human counterpart.** This brings funding (NCI Comparative Oncology) and makes the results useful beyond veterinary medicine.

Pets are good **sentinels**. They share the household's air, water and lawn chemicals. Cancer develops 5–10× faster in a dog's lifespan than in a person's. Dogs and cats also don't smoke, drink or have jobs, which removes some confounders.

---

## 2. Ranked shortlist

### Tier 1: an exposure or mechanism is established or strongly supported

| Cancer | Species | Exposure / mechanism | Why it's good for study | Human analog |
|---|---|---|---|---|
| **Urothelial (transitional cell) carcinoma, bladder** | Dog | Phenoxy herbicides (2,4-D) on lawns, older flea dips, obesity, female sex. Scottish Terriers carry roughly 18–20× the risk. | Gene × environment interaction is documented (Glickman 2004, Scotties + lawn herbicide). **BRAF V595E** is present in about 85% of cases and detectable in urine (Antech CADET BRAF), so you get a molecular endpoint without a biopsy. | Muscle-invasive bladder cancer |
| **Injection-site sarcoma (FISS)** | Cat | Chronic inflammation at injection sites, historically adjuvanted rabies/FeLV vaccines | A classic causation case. Dose-response was shown by injection site, and vaccine sites were then moved to the tail and limbs. | Inflammation-driven sarcoma |
| **Lymphoma** | Cat | FeLV/FIV retroviruses; secondhand smoke (Bertone 2002, about 2.4×) | The viral cause is proven. A smoke-exposure dose-response was shown. | Viral and environmental NHL |
| **Oral squamous cell carcinoma** | Cat | Secondhand smoke, flea collars, canned food / tuna (Bertone 2003); p53 involvement | A case-control design worked well. Exposures are household-level. | Head and neck SCC |
| **Cutaneous SCC (ear tips, nose)** | White cats; Hereford cattle (ocular) | UV light combined with lack of pigment | Natural dose-response by pigment and latitude | UV-induced SCC |
| **Mesothelioma** | Dog | Asbestos (owner's job or hobby, Glickman 1983) | The exposure is rare, specific and documented | Mesothelioma |
| **Viral tumours** | Cattle, horse, poultry, devil | Bovine leukemia virus; BPV in equine sarcoid; Marek's disease virus; Tasmanian devil and canine transmissible tumours (CTVT) | The cause is known, which makes them useful for mechanism and transmission work | Viral oncogenesis |

### Tier 2: breed, genetic or hormonal risk is strong, environmental cause unclear

| Cancer | Species | Key signal | Notes |
|---|---|---|---|
| **Osteosarcoma** | Dog | Giant breeds (Rottweiler, Great Dane, Irish Wolfhound). Early gonadectomy roughly doubles risk (Cooley 2002, Rottweilers). | Best large-animal model for pediatric osteosarcoma. Many trial datasets exist (COTC). |
| **Hemangiosarcoma** | Dog | Golden Retriever, German Shepherd; neuter timing (Hart 2013/2020) | Analog of angiosarcoma. Often diagnosed only at death, so EHR data under-counts it relative to pathology data. |
| **Mast cell tumour** | Dog | Boxers, Labradors, Pugs; KIT exon 11/8 mutations | The most common malignant tumour in lab data. Graded consistently (Kiupel 2-tier), so it codes well. |
| **Mammary tumours** | Dog, cat | Spay timing and progesterone exposure (Schneider 1969). A 2012 systematic review (Beauvais) called the evidence weak. | A good target for a well-designed modern study because the literature is contested. |
| **Lymphoma (multicentric)** | Dog | Golden Retriever, Boxer. Herbicide link (Hayes 1991) is debated. Urban and industrial residence. | The 2,4-D question is still open. Large numbers make it worth revisiting. |
| **Nasal carcinoma** | Dog | Long-nosed (dolichocephalic) breeds, indoor combustion, smoke exposure (Reif 1998) | A clean air-quality sentinel |
| **Oral malignant melanoma** | Dog | Pigmented-mucosa breeds | Model for mucosal melanoma. Has an approved vaccine (Oncept). |

### Tier 3: useful for incidence or descriptive work, weak for causation
Lipoma, histiocytoma, sebaceous adenoma and other benign skin tumours. They dominate pathology volume, which makes them useful as **control/denominator tumours** in case-control designs (for example, comparing MCT with lipoma submissions).

---

## 3. Data sources

### Pathology and lab-based registries (histology and cytology reports)
| Source | Scope | Access | Notes |
|---|---|---|---|
| **SAVSNET Tumour Registry** (Univ. Liverpool) | UK. Over 1M dog and cat tumours from 2010–2023, from participating diagnostic labs, extracted by text-mining | Public dashboard; research access by agreement | Closest existing example of a lab-fed registry. A 2026 case-control study used 131k histology-confirmed tumours (melanoma, HSA, OSA, MCT). |
| **Italian pathology registries** (Genoa, Piedmont, central Italy) | 26k tumours (2008–23) in the central-Italy registry, coded in Vet-ICD-O-canine-1 | Academic | Reported malignancy risk rising 8% per year of age |
| **Swiss Canine Cancer Registry** | 1955–2008, about 120k tumours from Swiss pathology institutes | Published datasets | Long time series |
| **Vet-OncoNet** (Portugal), **Danish / Norwegian** canine registries, **Kraków** registry | National or regional | Varies | Several are inactive. Most animal registries have not lasted. |
| **Commercial reference labs**: IDEXX, Antech (Mars), Zoetis Reference Labs, university labs (Cornell AHDC, CSU, UC Davis, Purdue ADDL) | The largest pool of veterinary histopathology in the US | Proprietary; research partnerships only | Most veterinary cancer diagnoses sit in private labs. Getting at that data is the main bottleneck. |

### Clinical, EHR and cohort sources (provide the population denominator)
- **VetCompass** (RVC, UK): primary-care EHRs for over 30% of UK practices. Gives true population denominators.
- **VMDB** (Veterinary Medical Database): North American teaching hospitals since 1964. Biased toward referral cases.
- **Banfield / Mars Veterinary Health**: over 1,000 US hospitals on one PIMS.
- **Agria (Sweden), Trupanion, Nationwide**: pet-insurance claims. Agria has the classic cohort data (Egenvall, Bonnett).
- **Golden Retriever Lifetime Study** (Morris Animal Foundation): about 3,000 dogs followed prospectively, with environmental samples. Built for causation questions about lymphoma and HSA.
- **Dog Aging Project**: over 50k dogs, open data via Terra, linked EHR and genomics.
- **Darwin's Ark**: owner-reported data plus genomics.

### Genomic and trial data
- **NCI Integrated Canine Data Commons (ICDC)**: open access. Clinical, WGS/WES, RNA-seq and methylation data, including COTC trial cohorts. Part of the Cancer Research Data Commons, so it sits next to human data.
- **CCOGC biospecimen repository**: banked canine tumour tissue.
- **Liquid-biopsy players**: PetDx OncoK9 (CANDiD study), Volition Nu.Q Vet, Antech CADET BRAF. These give early-detection endpoints.

### Coding standard
**Vet-ICD-O-canine-1** (GIVCS, 2022): 335 topography and 534 morphology codes, mapped to human ICD-O-3.2. Anything Vetra structures should emit these codes so results can merge with registries and human data.

---

## 4. Design notes (what goes wrong)

- **Pathology data lacks a denominator.** It counts tumours biopsied, not dogs at risk. Use **proportional morbidity ratios** or **case-control designs with other-tumour controls**, or link to EHR or insurance data for the at-risk population.
- **Submission bias.** Owners who can afford a biopsy are not typical. Cancers diagnosed at end of life (HSA, many OSA cases) are under-represented.
- **Breed confounds everything.** Stratify or match on breed. Treat neuter status and age-at-neuter as separate variables.
- **Exposure measurement.** Lab data has no exposure fields. Link postcode or ZIP to environmental layers (EPA, air quality, pesticide-use maps) and add structured owner questionnaires.
- **Causation needs more than correlation.** Look for dose-response, temporality (a prospective cohort such as GRLS), biological plausibility (BRAF, KIT, p53), and replication across registries (Bradford Hill criteria).

---

## 5. What this means for Vetra (for discussion, not a commitment)

- **Pip** already files IDEXX and Antech lab and histopath reports into the chart. Structured histopath fields (diagnosis, grade, margins, mitotic count) plus Vet-ICD-O codes plus signalment would turn clinic data into **registry-grade records**, which is what SAVSNET had to build with text-mining.
- **Groups (4–80+ sites, mixed PIMS)** have the volume for real cohort denominators. A de-identified, opt-in multi-site research export fits the multi-site dashboard story.
- **Independents** benefit from quick wins: a breed-risk prompt at intake (for example, "Scottish Terrier, 8y: consider urine BRAF screen") and recruitment into studies.
- **Hazel** can carry follow-up cadences for chemo patients. **Willow** handles the end-of-life side, where many HSA and OSA cases end.
- **Gating questions before any of this:** who owns lab data under clinic–lab contracts, owner consent, de-identification, and whether research export is a Pip feature or a separate product. Per CLAUDE.md, no new agent without a conversation.

---

## Key references
- Pinello K. et al. *Vet-ICD-O-Canine-1.* Cancers 2022. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8946502/
- Rodríguez J. et al. *Text-mining analysis of 100,000 tumours in UK dogs and cats.* Sci Data 2021. https://www.nature.com/articles/s41597-021-01039-x
- SAVSNET Tumour Registry. https://www.liverpool.ac.uk/savsnet/research/tumour-registry
- NCI Integrated Canine Data Commons. https://datacommons.cancer.gov/repository/integrated-canine-data-commons
- Glickman L.T. et al. Herbicide exposure and bladder cancer in Scottish Terriers. JAVMA 2004.
- Bertone E.R. et al. Environmental tobacco smoke and feline lymphoma (AJE 2002) / oral SCC (JVIM 2003).
- Cooley D.M. et al. Endogenous gonadal hormone exposure and bone sarcoma risk. CEBP 2002.
- Hart B.L. et al. Neutering and joint disorders and cancers in Golden Retrievers. PLoS ONE 2013; Front Vet Sci 2020.
- Beauvais W. et al. Effect of neutering on mammary tumour risk: systematic review. JSAP 2012.
- Reif J.S. et al. Passive smoking and canine nasal/lung cancer. AJE 1998.
