Hackathon PRD

2 hours \- sync

Pay Pal  
TODO list

**2-Page Policy Doc \- Carter and Renata**

**Carter Deliverables**: Current regulations \- at what point can non-matched information be shared? 

List of signals that are shareable under current regulations.

**Renata Deliverables:**   
Incentives, pros and cons \- what this solves, why it’s better than the Status Quo  
Users are early warners 

Incentives (PRIVATE) 

FUND PARTICIPATATION\> 

COMPANY a) loses 5million due to fraud   
                   b) loses 2 million due to fraud 

Company B has a competitive advantage upon company A. Fraud is not only concerned with global crime but it is also tied to competitiveness. Risks include great corporations like paypal shutting down due to reimbursement payments, putting at risk millions of users and a valuable service. 

Individual countries can be involved in the law enforcement of the fraud matrix being implemented and the fining system 

INTERPOL (check how can corrupted it can be) to implement sanctions to all actors involved in the fraud ecosystem, fining  them upon their grade of responsibility and contribution to crime.  

Advocationg of Environmental scanners (weak signal), if they sahre acorss the network the fine is reduced. Polycentred threat detection model  Accessible data outbreak chains

Fines / reputational risk (certification) and loss of this certification.   
granted by NHS data breaches  

Failure model sector   
Symbollic enforcement   
Accessible data outbreak chains  
By early detection with the matrix they have an percentage of reimbursement pool   
**ACTORS** **INVOLVED IN REIMBURSEMENT AND LAW ENFORMEN**T 

1. Government and International Institutions (Law enforcement) 

\-\> assumptions   
\-\> considerations: Geopolitical risks, challenges, individual differences  
 

2. Private institutions 

\-\> \-\> assumptions   
\-\> considerations: Competitiveness, 

Rating matrix \- policies to assess \- (What we can access?) \- (What is the ideas matrix?) (What are the incentives?)

***Demo part B \- Vika, Julia and Shutian***

**Vika Deliverables**: 

***Telegram data collection:***

| Entity | Attributes | Storage Logic |
| :---- | :---- | :---- |
| **User Account** | User\_ID (Primary Key), Phone\_Number, Username, Screen\_Name, Bio, Profile\_Photo\_Blob, Language\_Code | **Cloud:** Persistent for account identification. |
| **Contact List** | Owner\_ID, Contact\_Phone\_Number, Contact\_First\_Name, Contact\_Last\_Name | **Cloud:** Synced from device to notify of new sign-ups. |
| **Cloud Chat** | Chat\_ID, Chat\_Type (Private/Group/Channel), Participant\_List, Message\_History\_Ref | **Cloud:** Distributed and encrypted; Telegram holds keys. |
| **Message (Cloud)** | Message\_ID, Sender\_ID, Timestamp, Text\_Content, Media\_Link, Metadata\_IP, Read\_Status | **Cloud:** Accessible across all logged-in sessions. |
| **Secret Chat** | Auth\_Key\_ID, Device\_ID\_A, Device\_ID\_B, TTL\_Setting (Self-destruct) | **Local:** End-to-End Encrypted. No content exists on servers. |
| **Device/Session** | Session\_Hash, Device\_Model, OS\_Version, App\_Version, Last\_IP\_Address, Login\_Time | **Cloud:** Used for security logs and "Active Sessions" list. |
| **Bot Interaction** | Bot\_ID, User\_ID, Last\_Command, Chat\_Context | **Cloud/Third-Party:** Data shared with the bot's developer. |

***PayPal data collection:***

| Entity | Attributes | Shared With |
| :---- | :---- | :---- |
| **Identity Profile** | Legal Name, Address, **Tax ID/SSN**, Government ID photo, Date of Birth, Biometric Data. | Identity verification vendors, Sanction list providers, Regulators. |
| **Financial Ledger** | Bank Account/Routing numbers, Linked Card details, **Income**, Creditworthiness scores. | Banks, Credit bureaus, Payment processors (e.g., Visa/Mastercard). |
| **Transaction History** | Amount, Currency, **Merchant Name**, Shipping Address, IP Address, Goods/Services purchased. | Merchants (to fulfil orders), Fraud detection vendors, Tax authorities. |
| **Inferred Data** | Purchasing habits, Behavioural patterns, Risk/Fraud score, Professional/Employment status. | Internal systems for "Experience personalisation" and Risk Management. |
| **Contact Sync** | Imported contact list (Names, Emails, Phone numbers). | Not typically shared externally; used for internal network mapping. |

***Instagram data collection:***

| Entity | Attributes | Shared With |
| :---- | :---- | :---- |
| **Core User** | Username, Name, Linked Facebook ID, Email, Phone Number, Follower/Following lists. | Meta Family of Apps (Facebook/WhatsApp), Third-party apps via API. |
| **Content Engagement** | Photos/Videos, Captions, Comments, Likes, Saved Posts, **DMs (No longer E2EE)**. | **Meta AI** (for model training), Advertisers (aggregated insights). |
| **Behavioral Metadata** | Time spent on posts, Scroll depth, Interaction frequency with specific accounts/topics. | Advertisers (for hyper-targeted "Interest-based" ads). |
| **Device & Network** | Precise Geolocation, IP Address, Device Model, OS, Battery Level, Bluetooth signals. | Meta's internal ad-bidding engine, Security/Spam filters. |
| **Off-Platform Activity** | Websites visited that use Meta Pixel or "Login with Instagram." | Advertisers (to "retarget" you with ads for things you viewed elsewhere). |

| Feature | Telegram | Instagram | PayPal |
| :---- | :---- | :---- | :---- |
| **Phone Number** | Required | Required | Required |
| **IP Address Logging** | Yes (12 months) | Yes (Indefinite) | Yes (Compliance-based) |
| **Contact Syncing** | Optional but encouraged | Optional but encouraged | Optional but encouraged |
| **Third-Party Sharing** | Limited (Technical) | Extensive (Ad/AI) | Extensive (Financial/KYC) |
| **Law Enforcement** | Discloses IP/Phone | Discloses Full Profile | Discloses Financial History |

Message parser that ranks the level of fraud  
System prompt \- what is fraud   
Fraud signals \- age of the account  
How does the most capable attacker execute?  
Scammers (AI agents) talk to each other \- Telethon and real cybercrime channels \- we return the fraud score \- Telegram \- feed the number to the matrix \- create the pipeline live \- funny conversation \- try to buy heroin \- got scammed  
Small model  
OpenAI \- GPT 5 mini

**Julia Deliverables**:

How do all actors measure fraud and evaluate it?  
Rating matrix

**Shutian Deliverables**: What data does PayPal collect? What do they need?

Name, business name, date of birth, age, nationality, citizenship, address, government based id, social security number, biometric data (e.g. face id), electronic signature, military status, gender, job title, income, email address, phone number, 

J:

- \+/- – policy

Best fraud \-\> matrix 

**UNIVERSAL PAYPAL MATRIX**

| PAYPAL |  WEIGHTED SUM |
| :---- | :---- |
| GOVERMENT1 | NG1 \-  |
| SM1 | NS1 |
| GOVERMENT2 | NG2 |
| SM2 | NS2 |
| GOVERMENT2 | NG3 |
| SM2 | NS3 |

WEIGHTED SUM= G1\*NG1+S1\*NS1+G2\*NG2+S2\*NS2+G3\*NG3+S3\*NS3

- G1, S1, G2, S2, G3, S3 \- weights for values of G/S  
- NG1… \- 

How to learn the weights?

- The Final Value from the government/SM provided should be weighted 

By 3 Goverments \~ 6 G

Goverment Matrix:

|  |  |
| :---- | :---- |
|  |  |
|  |  |
|  |  |

Third party organisation Matrix:

|  |  |
| :---- | :---- |
|  |  |
|  |  |
|  |  |

- Request any info? Requirements of organisation   
    
    
    
- Leaned   
- Fraude \- take \- pull   
- Check test \- 80  
- Data \- 

For each data provider/source s, define its value as:

Value(s)=U(model trained with source s)−U(model trained without source s)

Where **business/risk utility function**
Where U - business/risk utility function

example:
 
U= fraud losses prevented − false-positive review cost − customer friction cost − investigation cost

It was proposed specifically as a principled framework for valuing data in supervised ML


1) Historical, F/N

TENTATIVE SUMMARY  
In the United Kingdom, if you lose your money to a scammer, the bank used in the scam is generally responsible for making you whole. This creates a perverse set of incentives – social media sites and other venues for fraud only need to prevent it in order to improve user experience, not protect their users. Each actor in the “fraud chain” has access to different information, but there is no financial incentive to share it. This is called “information cloistering”, and necessitates a solution that A: enables aggregate information, or “signals” of fraud, to be shared without violating privacy laws, and B: a regulatory framework that incentivizes each actor to share that information.  

We propose a polycentric threat detection model wherein individual actors (governments, private firms, current distributed systems like GSE, cybersecurity analysts and fraud researchers, individuals who act as early warning sentinels) proactively share not *data* per se, but whether there are *matches* for this data in other actors’ systems that indicate fraudulent activity. In PayPal’s case, at the moment of registration of an account, they would receive a report noting whether the phone number, email address, or other PII used to register the account was associated with fraud in other actors’ datasets. **(WHO WOULD RATE THIS INFORMATION AND HOW?)**

(POLICY BIT BELOW)

To incentivize each individual information cloister to opt in to this system, we recommend legislation that proportionally distributes the liability to repay fraudulent payments *across the chain* and imposes new fines equal to the cost of the repaid fraudulent payment. To borrow from the cybersecurity concept of “bug bounties”, these fines will be reserved to pay out to the firms in the chain that successfully stop fraud before it occurs – based on information shared with law enforcement. These successful entities will be rewarded with a publicly accessible “security certification”. This will incentivize not just *reactive* responses to fraud, but *proactive* prevention of scams.

GSE Pricing Tiers (from globalsignalexchange.org/plans)
The GSE offers three tiers. "Contribute" is free: you can send signals, share feedback, upload via CSV and API, and join groups as an observer. "Respond" starts from 50,000 GBP annually: you get full API access, the ability to receive and enrich signals, access to all available feeds, the ability to create and manage up to 5 groups, and integration of third-party commercial signals. "Command" is negotiable pricing: it includes full platform capabilities, strategic partnership opportunities, options to unlock additional compute and query services (powered by Google Cloud BigQuery), early access to new features and research outputs, and R&D opportunities. Law enforcement and national anti-scam centres get Command tier for free. 
Rates for the Command tier depend on organisation size, requirements, and usage, with special plans available for police, public safety organisations, charities, not-for-profits, and membership organisations. All prices are exclusive of VAT, and applications are open to businesses and organisations subject to accreditation terms. 
So for PayPal, the realistic contract would be the "Respond" tier at minimum (50,000 GBP/year baseline), but more likely the "Command" tier given their scale, which would be a negotiated rate. For a company of PayPal's size consuming high-volume API feeds with BigQuery compute, a reasonable estimate would be in the range of 100,000 to 500,000 GBP annually, though this is my informed inference rather than a published figure.

GASA Membership Pricing
The GASA membership pricing is displayed as images on their site, which I could not extract the text from. However, from the page structure: GASA has 30 Foundation members, 29 Corporate members, 52 Supporting members, and 96 Associated organisations. Foundation members include JPMorgan Chase, Mastercard, Visa, Lloyds Bank, Capital One, Scotiabank, Nasdaq, and Feedzai. 
Notably, PayPal is absent from every tier of GASA membership. Their direct competitors in payments (Visa, Mastercard, JPMorgan, Capital One) are all Foundation members. This is a significant strategic gap.
GASA membership is separate from GSE membership. GASA membership benefits include program and policy involvement, access to research and best practices, entry to the GASA member directory, participation in working groups, and free tickets to summits and events. GASA Foundation membership likely runs in the range of 10,000 to 50,000 EUR annually based on comparable industry alliance pricing, but the exact figures are behind those image-based pricing cards.

DNSRF/OXIL: What they provide distinctly
DNSRF operates the DAP.live platform, an open data, feeds, and analytics service offering free data, dashboards, a developer API, and notifications. Their core mission is advancing understanding of the Domain Name System's impact on cybersecurity, policy, and technical standards. 
The DAP.live platform provides data feeds across categories including phishing reports (sourced from OpenPhish), malware reports (sourced from URLHaus), domain name registration data (from ICANN's Centralised Zone Data Service), top domain rankings (Tranco, Google CrUX), and blockchain domain data. Their partners include Google, APWG, Spamhaus, Meta, the Motion Picture Association, and multiple academic institutions and internet registries.
DNSRF is essentially the technical backbone. They do not sell data access separately from the GSE for fraud prevention purposes. Their independent DAP.live platform is more research-oriented. For PayPal's use case, engaging DNSRF independently would not be the right path. The GSE is the product.

Revised assessment: What PayPal would actually need
The practical partnership structure would be two contracts, not three:
First, a GSE "Respond" or "Command" membership (50,000+ GBP/year) for the real-time threat intelligence feeds, API access, and signal enrichment. This is the operational layer that feeds PayPal's fraud detection systems.
Second, a GASA Foundation membership for the strategic, policy, and working group layer. This puts PayPal at the table alongside JPMorgan, Mastercard, Visa, Lloyds, and Nasdaq in shaping anti-scam policy and sharing intelligence at the human/institutional level.
There is no need for a separate DNSRF/OXIL contract because OXIL manages the GSE platform. Engaging GSE engages their technology.

How GSE signal types map to each fraud category (refined)
The GSE now supports these signal types: URLs, IP addresses, domain names, email addresses, CIDR blocks, blockchain domain names, cryptocurrency wallet addresses, transaction IDs, and IBAN bank account numbers. That last category (IBANs and transaction IDs) is newer and more directly relevant to financial fraud than my previous analysis suggested.
For APP fraud, the fit is very strong. PayPal could cross-reference outbound payment destinations against known scam IBANs, flag transactions initiated from sessions that visited known scam URLs, and detect payments to merchants operating from domains flagged in the GSE. The IBAN signal type is particularly valuable: if a receiving bank account has been flagged by another GSE member as associated with APP fraud, PayPal could intervene before the push payment settles.
For unauthorised fraud, the fit is moderate but useful. Phishing URLs and malicious IP addresses from the GSE can enrich PayPal's login anomaly detection. If a user's session originates from an IP in a flagged CIDR block, or if the referral URL matches a known phishing page, that signal raises the risk score for the session.
For first-party fraud, the fit remains the weakest but is no longer negligible. The transaction ID and IBAN signal types mean that if other GSE members flag specific accounts or transaction patterns as first-party fraud, PayPal could consume those signals. This requires the broader financial services community to actively contribute first-party fraud indicators into the GSE, which is still nascent.
For collusion fraud, the fit is moderate and growing. The combination of email addresses, IBANs, cryptocurrency wallets, and domain names allows network mapping across seemingly unrelated accounts. The NCA case study demonstrated this precisely: four URLs and 87 email addresses were used to uncover a network of nearly 50,000 accounts running multiple fraud types simultaneously. PayPal could contribute its own signals about coordinated transaction patterns and consume signals from others to detect collusion rings that span multiple payment platforms. 

Bottom line
The total annual cost for PayPal to fully engage would likely be in the range of 100,000 to 600,000 GBP across GSE membership and GASA Foundation membership combined. This is trivially small relative to PayPal's fraud losses (their 10-K references "transaction and credit losses" of over $1.8 billion annually). The strategic question is not cost but whether PayPal is willing to share its own fraud signals bidirectionally, which is the core requirement for GSE membership to deliver value. The fact that every major competitor (Visa, Mastercard, JPMorgan, Lloyds, Capital One) is already at the GASA table, and that Google, Microsoft, Meta, and Amazon are GSE data providers, suggests that PayPal's absence is a gap worth closing.