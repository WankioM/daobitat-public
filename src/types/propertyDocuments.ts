// src/types/DocumentTypes.ts

export enum DocumentType {
    TITLE_DEED = 'titleDeed',
    CERTIFICATE_OF_LEASE = 'certificateOfLease',
    RATES_CLEARANCE = 'ratesClearance',
    LAND_RENT_CLEARANCE = 'landRentClearance',
    UTILITY_BILL = 'utilityBill',
    COURT_JUDGMENT = 'courtJudgment',
    PROBATE = 'probate',
    CONSENT_TO_TRANSFER = 'consentToTransfer',
    SALE_AGREEMENT = 'saleAgreement',
    STAMP_DUTY_RECEIPT = 'stampDutyReceipt',
    ADVERSE_POSSESSION = 'adversePossession',
    AFFIDAVIT = 'affidavit',
    OTHER = 'other'
  }
  
  // Human-readable display names for each document type
  export const DocumentTypeLabels: Record<DocumentType, string> = {
    [DocumentType.TITLE_DEED]: 'Title Deed',
    [DocumentType.CERTIFICATE_OF_LEASE]: 'Certificate of Lease or Ownership',
    [DocumentType.RATES_CLEARANCE]: 'Rates Clearance Certificate',
    [DocumentType.LAND_RENT_CLEARANCE]: 'Land Rent Clearance Certificate',
    [DocumentType.UTILITY_BILL]: 'Utility Bills',
    [DocumentType.COURT_JUDGMENT]: 'Court Judgment',
    [DocumentType.PROBATE]: 'Probate or Letters of Administration',
    [DocumentType.CONSENT_TO_TRANSFER]: 'Consent to Transfer',
    [DocumentType.SALE_AGREEMENT]: 'Sale Agreement',
    [DocumentType.STAMP_DUTY_RECEIPT]: 'Stamp Duty Receipt',
    [DocumentType.ADVERSE_POSSESSION]: 'Adverse Possession Documentation',
    [DocumentType.AFFIDAVIT]: 'Affidavit from Neighbors or Chiefs',
    [DocumentType.OTHER]: 'Other Document'
  };
  
  // Document type descriptions
  export const DocumentTypeDescriptions: Record<DocumentType, string> = {
    [DocumentType.TITLE_DEED]: 'Official ownership document issued by the government',
    [DocumentType.CERTIFICATE_OF_LEASE]: 'Document showing leasehold rights of the property',
    [DocumentType.RATES_CLEARANCE]: 'Certificate showing all property rates are paid up',
    [DocumentType.LAND_RENT_CLEARANCE]: 'Certificate showing land rent payments are up to date',
    [DocumentType.UTILITY_BILL]: 'Recent bills for water, electricity, or other utilities',
    [DocumentType.COURT_JUDGMENT]: 'Legal document from court granting ownership through succession, divorce, or dispute resolution',
    [DocumentType.PROBATE]: 'Legal document confirming the right to manage a deceased person\'s estate',
    [DocumentType.CONSENT_TO_TRANSFER]: 'Approval for property transfer, especially for agricultural land',
    [DocumentType.SALE_AGREEMENT]: 'Legal contract detailing the sale terms between buyer and seller',
    [DocumentType.STAMP_DUTY_RECEIPT]: 'Receipt showing property transaction tax has been paid',
    [DocumentType.ADVERSE_POSSESSION]: 'Documentation of occupying land openly for 12+ years as basis for ownership',
    [DocumentType.AFFIDAVIT]: 'Sworn statements from neighbors or community leaders confirming ownership',
    [DocumentType.OTHER]: 'Any other relevant property documentation'
  };