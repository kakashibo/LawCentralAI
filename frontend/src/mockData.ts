import type { LegalCase, ResearchCase } from './types'

export const MOCK_CASES: LegalCase[] = [
  {
    id: 'C-2024-001',
    title: 'Sharma v. TechSolutions Pvt Ltd',
    type: 'Employment Dispute',
    status: 'Discovery',
    client: 'Rajesh Sharma',
    lastUpdated: '2 hours ago',
    deadlines: [{ task: 'Submit Rejoinder', date: 'Oct 24, 2024', id: 1 }],
    artifacts: [
      { id: 1, name: 'Employment Contract.pdf', type: 'document', date: '2023-01-12' },
      { id: 2, name: 'Termination Letter.pdf', type: 'document', date: '2023-03-15' },
    ],
    notes:
      'Client alleges wrongful termination under Section 25F of the Industrial Disputes Act.',
  },
  {
    id: 'C-2024-042',
    title: 'In Re: Estate of V. Kapoor',
    type: 'Probate',
    status: 'Drafting',
    client: 'Anjali Kapoor',
    lastUpdated: '1 day ago',
    deadlines: [{ task: 'File Probate Petition', date: 'Oct 30, 2024', id: 1 }],
    artifacts: [{ id: 1, name: 'Will_Final_2020.pdf', type: 'document', date: '2020-11-05' }],
    notes: 'Focus on the validity of the codicil dated Jan 2021.',
  },
  {
    id: 'C-2024-088',
    title: 'Merger: GreenEnergy & SolarInfra',
    type: 'Corporate',
    status: 'Review',
    client: 'GreenEnergy Ltd',
    lastUpdated: '3 days ago',
    deadlines: [{ task: 'NCLT Filing', date: 'Nov 12, 2024', id: 1 }],
    artifacts: [],
    notes: 'Review compliance with Competition Act, 2002.',
  },
]

export const MOCK_INDIAN_CASES: ResearchCase[] = [
  {
    id: 'R-SC-2017-01',
    citation: 'AIR 2017 SC 4161',
    title: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
    court: 'Supreme Court of India',
    date: '24 Aug 2017',
    bench: '9 Judge Constitution Bench',
    tags: ['Constitutional Law', 'Privacy', 'Article 21', 'Aadhar'],
    status: 'good_law',
    snippet:
      'The right to privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21 and as a part of the freedoms guaranteed by Part III of the Constitution.',
    summary:
      'Landmark judgment declaring the Right to Privacy as a fundamental right under the Indian Constitution. Overruled MP Sharma and Kharak Singh cases.',
    judgement_text:
      'HELD: \n1. Life and personal liberty are inalienable rights. These are rights which are inseparable from a dignified human existence.\n2. Privacy with its attendant values assures dignity to the individual and it is a cardinal value of the Indian Constitution.\n3. The judgment in MP Sharma holding that the Constitution does not specifically protect the right to privacy is overruled...',
  },
  {
    id: 'R-SC-1973-01',
    citation: 'AIR 1973 SC 1461',
    title: 'Kesavananda Bharati v. State of Kerala',
    court: 'Supreme Court of India',
    date: '24 Apr 1973',
    bench: '13 Judge Constitution Bench',
    tags: ['Constitutional Law', 'Basic Structure', 'Amendment Power'],
    status: 'good_law',
    snippet:
      'Parliament cannot alter the basic features of the Constitution. The power to amend does not include the power to abrogate the Constitution.',
    summary:
      'Established the Basic Structure Doctrine. Parliament can amend any part of the Constitution provided it does not alter its basic structure.',
    judgement_text:
      'HELD: \nBy majority, the decision of the Court is as follows:\n1. Golak Nath\'s case is overruled.\n2. Article 368 does not enable Parliament to alter the basic structure or framework of the Constitution.\n3. The Constitution (Twenty-fourth Amendment) Act, 1971 is valid...',
  },
  {
    id: 'R-DEL-2023-45',
    citation: '2023 SCC OnLine Del 1234',
    title: 'XYZ v. State (NCT of Delhi)',
    court: 'Delhi High Court',
    date: '15 Mar 2023',
    bench: 'Division Bench',
    tags: ['Criminal Law', 'Bail', 'BNS 2023'],
    status: 'distinguished',
    snippet:
      'Considerations for bail under the new Bharatiya Nagarik Suraksha Sanhita (BNSS) require a stricter interpretation of flight risk.',
    summary:
      'Discussion on the transition from CrPC to BNSS regarding bail provisions for economic offenses.',
    judgement_text:
      'The court observed that while personal liberty is paramount, the legislative intent behind the new Sanhita reflects a need for stricter compliance in cases involving economic fraud...',
  },
  {
    id: 'R-NCLT-2022-89',
    citation: 'CP (IB) No. 99/2022',
    title: 'Creditor Bank v. Infra Buildtech Ltd',
    court: 'NCLT, Mumbai Bench',
    date: '10 Feb 2022',
    bench: 'Single Bench',
    tags: ['IBC', 'Insolvency', 'Corporate'],
    status: 'good_law',
    snippet:
      'Initiation of CIRP under Section 7 of the IBC. Default amount exceeded the threshold limit.',
    summary:
      'Admission of insolvency petition against corporate debtor for default in repayment of term loans.',
    judgement_text:
      'It is established that there is a debt and a default. The application is complete in all respects. We hereby admit the petition under Section 7...',
  },
]
