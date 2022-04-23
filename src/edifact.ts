/**
 * @author Roman Vottner
 * @copyright 2020 Roman Vottner
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ResultType } from "./reader";

export function sanitizeFloat(str: string, decimalSymbol: string): number {
    const updatedStr: string = str.replace(decimalSymbol, ".");
    return parseFloat(updatedStr);
}

export interface Segment {
    tag: string;
}

export function toSegmentObject(data: ResultType, version: string, decimalSeparator: string): Segment {
    switch (data.name) {
        case "AJT":
            return new AdjustmentDetails(data);
        case "ALC":
            return new AllowanceOrCharge(data);
        case "ALI":
            return new AdditionalInformation(data);
        case "APR":
            return new AdditionalPriceInformation(data, decimalSeparator);
        case "ARD":
            return new MonetaryAmountFunction(data);
        case "AUT":
            return new AuthenticationResult(data);
        case "BGM":
            return new BeginOfMessage(data);
        case "BUS":
            return new BusinessFunction(data);
        case "CAV":
            return new CharacteristicValue(data);
        case "CCI":
            return new CharacteristicClassID(data);
        case "CED":
            return new ComputerEnvironmentDetails(data);
        case "CNT":
            return new ControlTotal(data, decimalSeparator);
        case "COD":
            return new ComponentDetails(data);
        case "COM":
            return new CommunicationContact(data);
        case "CPS":
            return new ConsignmentPackingSequence(data);
        case "CTA":
            return new ContactInformation(data);
        case "CUX":
            return new Currencies(data, decimalSeparator);
        case "DGS":
            return new DangerousGoods(data);
        case "DLM":
            return new DeliveryLimitations(data);
        case "DMS":
            return new MessageSummary(data);
        case "DOC":
            return new MessageDetails(data);
        case "DTM":
            return new DateTimePeriod(data);
        case "EFI":
            return new ExternalFileLinkIdentification(data);
        case "EQA":
            return new AttachedEquipment(data);
        case "EQD":
            return new EquipmentDetails(data);
        case "ERC":
            return new ApplicationErrorInformation(data);
        case "FII":
            return new FinancialInstitutionInformation(data);
        case "FTX":
            return new FreeText(data);
        case "GEI":
            return new ProcessingInformation(data);
        case "GIN":
            return new GoodsIdentityNumber(data);
        case "GIR":
            return new RelatedInformationNumbers(data);
        case "GIS": // removed since D02B
            return new GeneralIndicator(data);
        case "HAN":
            return new HandlingInstructions(data);
        case "HYN":
            return new HierarchyInformation(data);
        case "IDE":
            return new Identity(data);
        case "IMD":
            return new ItemDescription(data);
        case "INP":
            return new PartiesAndInstruction(data);
        case "IRQ":
            return new InformationRequired(data);
        case "LIN":
            return new LineItem(data);
        case "LOC":
            return new LocationIdentification(data);
        case "MEA":
            return new Measurements(data);
        case "MOA":
            return new MonetaryAmount(data, decimalSeparator);
        case "MTD":
            return new MaintenanceOperationDetails(data);
        case "NAD":
            return new NameAndAddress(data);
        case "PAC":
            return new Package(data);
        case "PAI":
            return new PaymentInstructions(data);
        case "PAT": // removed since D02B
            return new PaymentTermsBasis(data);
        case "PCD":
            return new PercentageDetails(data, decimalSeparator);
        case "PCI":
            return new PackageIdentification(data);
        case "PGI":
            return new ProductGroupInformation(data);
        case "PIA":
            return new AdditionalProductId(data);
        case "PRI":
            return new PriceDetails(data, decimalSeparator);
        case "PYT":
            return new PaymentTerms(data);
        case "QTY":
            return new Quantity(data);
        case "QVR":
            return new QuantityVariances(data, decimalSeparator);
        case "RCS":
            return new RequirementsAndConditions(data);
        case "RFF":
            return new Reference(data);
        case "RJL":
            return new AccountingJournalIdentification(data);
        case "RNG":
            return new RangeDetails(data, decimalSeparator);
        case "RTE":
            return new RateDetails(data, decimalSeparator);
        case "SEL":
            return new SealNumber(data);
        case "SCC":
            return new SchedulingConditions(data);
        case "SEQ":
            return new SequenceDetails(data);
        case "SGP":
            return new SplitGoodsPlacement(data);
        case "STS":
            return new Status(data);
        case "TAX":
            return new TaxDetails(data);
        case "TDT":
            // eslint-disable-next-line no-case-declarations
            const lversion: string = version.toLowerCase();
            if (lversion === "d18b" || lversion === "d18a"
            || lversion === "d17b" || lversion === "d17a"
            || lversion === "d16b" || lversion === "d16a"
            || lversion === "d15b" || lversion === "d15a"
            || lversion === "d14b" || lversion === "d14a"
            || lversion === "d13b" || lversion === "d13a"
            || lversion === "d12b" || lversion === "d12a"
            || lversion === "d11b" || lversion === "d11a") {
                return new TransportInformationD11a(data);
            } else if (version === "d10b" || version === "d10a"
            || lversion === "d09b" || lversion === "d09a"
            || lversion === "d08b" || lversion === "d08a"
            || lversion === "d07b" || lversion === "d07a"
            || lversion === "d06b" || lversion === "d06a"
            || lversion === "d05b" || lversion === "d05a"
            || lversion === "d04b" || lversion === "d04a"
            || lversion === "d03b" || lversion === "d03a"
            || lversion === "d02b" || lversion === "d02a") {
                return new TransportInformationD02b(data);
            } else {
                return new DetailsOfTransport(data);
            }
        case "TMD":
            return new TransportMovementDetails(data);
        case "TOD":
            return new TermsOfDeliveryOrTransport(data);
        case "TSR":
            return new TransportServiceRequirements(data);
        case "UNH":
            return new MessageHeader(data);
        case "UNS":
            return new SectionControl(data);
        case "UNT":
            return new MessageTrailer(data);
        default:
            throw new Error(`Unsupported segment: ${data.name}`);
    }
}

// ////////////////////////////////////////////////////////////////////////////
// Segment section
// ////////////////////////////////////////////////////////////////////////////

// AJT

export class AdjustmentDetails implements Segment {

    tag = "AJT";

    adjustmentReasonDescriptionCode: string;
    lineItemIdentifier: string | undefined;

    constructor(data: ResultType) {
        this.adjustmentReasonDescriptionCode = data.elements[0][0];
        if (data.elements.length > 1) {
            this.lineItemIdentifier = data.elements[1][0];
        }
    }
}

// ALC

class AllowanceOrChargeInformation {
    allowanceOrChargeIdentifier: string | undefined;
    allowanceOrChargeIdentificationCode: string | undefined;

    constructor(data: string[]) {
        this.allowanceOrChargeIdentifier = data[0];
        this.allowanceOrChargeIdentificationCode = data[1];
    }
}

class SpecialServicesIdentification {
    specialServiceDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    specialServiceDescription: string | undefined;
    specialServiceDescription2: string | undefined;

    constructor(data: string[]) {
        this.specialServiceDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.specialServiceDescription = data[3];
        this.specialServiceDescription2 = data[4];
    }
}

export class AllowanceOrCharge implements Segment {

    tag = "ALC";

    allowanceOrChargeCodeQualifier: string;
    allowanceOrChargeInformation: AllowanceOrChargeInformation | undefined;
    settlementMeansCode: string | undefined;
    calculationSequenceCode: string | undefined;
    specialServicesIdentification: SpecialServicesIdentification | undefined;

    constructor(data: ResultType) {
        this.allowanceOrChargeCodeQualifier = data.elements[0][0];
        if  (data.elements.length > 1) {
            this.allowanceOrChargeInformation = new AllowanceOrChargeInformation(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.settlementMeansCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.calculationSequenceCode = data.elements[3][0];
        }
        if (data.elements.length > 4) {
            this.specialServicesIdentification = new SpecialServicesIdentification(data.elements[4]);
        }
    }
}

// ALI

export class AdditionalInformation implements Segment {

    tag = "ALI";

    countryOfOriginIdentifier: string | undefined;
    dutyRegimeTypeCode: string | undefined;
    specialConditionCode1: string | undefined;
    specialConditionCode2: string | undefined;
    specialConditionCode3: string | undefined;
    specialConditionCode4: string | undefined;
    specialConditionCode5: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.countryOfOriginIdentifier = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.dutyRegimeTypeCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.specialConditionCode1 = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.specialConditionCode2 = data.elements[3][0];
        }
        if (data.elements.length > 4) {
            this.specialConditionCode3 = data.elements[4][0];
        }
        if (data.elements.length > 5) {
            this.specialConditionCode4 = data.elements[5][0];
        }
        if (data.elements.length > 6) {
            this.specialConditionCode5 = data.elements[6][0];
        }
    }
}

// APR

class PriceMultiplierInformation {
    priceMuliplierRate: number;
    priceMuliplierTypeCodeQualifier: string | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.priceMuliplierRate = sanitizeFloat(data[0], decimalSeparator);
        this.priceMuliplierTypeCodeQualifier = data[1];
    }
}

class ReasonForChange {
    changeReasonDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCoe: string | undefined;
    changeReasonDescription: string | undefined;

    constructor(data: string[]) {
        this.changeReasonDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCoe = data[2];
        this.changeReasonDescription = data[3];
    }
}

export class AdditionalPriceInformation implements Segment {

    tag = "APR";

    tradeClassCode: string | undefined;
    priceMultiplierInformation: PriceMultiplierInformation | undefined;
    reasonForChange: ReasonForChange | undefined;

    constructor(data: ResultType, decimalSeparator: string) {
        if (data.elements.length > 0) {
            this.tradeClassCode = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.priceMultiplierInformation = new PriceMultiplierInformation(data.elements[1], decimalSeparator);
        }
        if (data.elements.length > 2) {
            this.reasonForChange = new ReasonForChange(data.elements[2]);
        }
    }
}

// ARD

class MonetaryAmountFunctionData {
    monetaryAmountFunctionDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    monetaryAmountFunctionDescription: string | undefined;

    constructor(data: string[]) {
        this.monetaryAmountFunctionDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.monetaryAmountFunctionDescription = data[3];
    }
}

class MonetaryAmountFunctionDetail {
    monetaryAmountFunctionDetailDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    monetaryAmountFunctionDetailDescription: string | undefined;

    constructor(data: string[]) {
        this.monetaryAmountFunctionDetailDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.monetaryAmountFunctionDetailDescription = data[3];
    }
}

export class MonetaryAmountFunction implements Segment {

    tag = "ARD";

    monetaryAmountFunction: MonetaryAmountFunctionData | undefined;
    monetaryAmountFunctionDetail: MonetaryAmountFunctionDetail | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.monetaryAmountFunction = new MonetaryAmountFunctionData(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.monetaryAmountFunctionDetail = new MonetaryAmountFunctionDetail(data.elements[1]);
        }
    }
}

// AUT

export class AuthenticationResult implements Segment {

    tag = "AUT";

    validationResultText: string;
    validationKeyIdentifier: string | undefined;

    constructor(data: ResultType) {
        this.validationResultText = data.elements[0][0];
        if (data.elements.length > 1) {
            this.validationKeyIdentifier = data.elements[1][0];
        }
    }
}

// BGM

class MessageName {
    documentNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    documentName: string | undefined;

    constructor(data: string[]) {
        this.documentNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.documentName = data[3];
    }
}

class MessageIdentification {
    documentIdentifier: string | undefined;
    versionIdentifier: string | undefined;
    revisionIdentifier: string | undefined;

    constructor(data: string[]) {
        this.documentIdentifier = data[0];
        this.versionIdentifier = data[1];
        this.revisionIdentifier = data[2];
    }
}

export class BeginOfMessage implements Segment {

    tag = "BGM";

    messageName: MessageName | undefined;
    messageIdentification: MessageIdentification | undefined;
    messageFunctionCode: string | undefined;
    responseTypeCode: string | undefined;
    documentStatusCode: string | undefined;
    languageNameCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.messageName = new MessageName(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.messageIdentification = new MessageIdentification(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.messageFunctionCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.responseTypeCode = data.elements[3][0];
        }
        if (data.elements.length > 4) {
            this.documentStatusCode = data.elements[4][0];
        }
        if (data.elements.length > 5) {
            this.languageNameCode = data.elements[5][0];
        }
    }
}

// BUS

class BusinessFunctionData {
    businessFunctionTypeCodeQualifier: string;
    businessFunctionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    businessDescription: string | undefined;

    constructor(data: string[]) {
        this.businessFunctionTypeCodeQualifier = data[0];
        this.businessFunctionCode = data[1];
        this.codeListIdentificationCode = data[2];
        this.codeListResponsibleAgencyCode = data[3];
        this.businessDescription = data[4];
    }
}

class BankOperation {
    bankOperationCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.bankOperationCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

export class BusinessFunction implements Segment {

    tag = "BUS";

    businessFunction: BusinessFunctionData | undefined;
    geographicAreaCode: string | undefined;
    financialTransactionTypeCode: string | undefined;
    bankOperation: BankOperation | undefined;
    intraCompanyPaymentIndicatorCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.businessFunction = new BusinessFunctionData(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.geographicAreaCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.financialTransactionTypeCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.bankOperation = new BankOperation(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.intraCompanyPaymentIndicatorCode = data.elements[4][0];
        }
    }
}

// CAV

class CharacteristicValueData {
    characteristicValueDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    characteristicValueDescription: string | undefined;
    characteristicValueDescription2: string | undefined;

    constructor(data: string[]) {
        this.characteristicValueDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.characteristicValueDescription = data[3];
        this.characteristicValueDescription2 = data[4];
    }
}

export class CharacteristicValue implements Segment {

    tag = "CAV";

    characteristicValue: CharacteristicValueData;

    constructor(data: ResultType) {
        this.characteristicValue = new CharacteristicValueData(data.elements[0]);
    }
}

// CCI

class CharacteristicDescription {
    characteristicDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    characteristicDescription: string | undefined;
    characteristicDescription2: string | undefined;

    constructor(data: string[]) {
        this.characteristicDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.characteristicDescription = data[3];
        this.characteristicDescription2 = data[4];
    }
}

export class CharacteristicClassID implements Segment {

    tag = "CCI";

    classTypeCode: string | undefined;
    measurementDetails: MeasurementDetails | undefined;
    characteristicDescription: CharacteristicDescription | undefined;
    characteristicRelevanceCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.classTypeCode = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.measurementDetails = new MeasurementDetails(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.characteristicDescription = new CharacteristicDescription(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.characteristicRelevanceCode = data.elements[3][0];
        }
    }
}

// CED

class ComputerEnviornmentIdentification {

    computerEnvironmentNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    computerEnvironmentName: string | undefined;
    versionIdentifier: string | undefined;
    releaseIdentifier: string | undefined;
    objectIdentifier: string | undefined;

    constructor(data: string[]) {
        this.computerEnvironmentNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.computerEnvironmentName = data[3];
        this.versionIdentifier = data[4];
        this.releaseIdentifier = data[5];
        this.objectIdentifier = data[6];
    }
}

export class ComputerEnvironmentDetails implements Segment {

    tag = "CED";

    computerEnvironmentDetailsCodeQualifier: string;
    computerEnviornmentIdentification: ComputerEnviornmentIdentification;
    fileGenerationCommandName: string | undefined;

    constructor(data: ResultType) {
        this.computerEnvironmentDetailsCodeQualifier = data.elements[0][0];
        this.computerEnviornmentIdentification = new ComputerEnviornmentIdentification(data.elements[1]);
        if (data.elements.length > 3) {
            this.fileGenerationCommandName = data.elements[3][0];
        }
    }
}

// CNT

class Control {
    controlTotalTypeCodeQualifier: string;
    controlTotalValue: number;
    measurementUnitCode: string | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.controlTotalTypeCodeQualifier = data[0];
        this.controlTotalValue = sanitizeFloat(data[1], decimalSeparator);
        this.measurementUnitCode = data[2];
    }
}

export class ControlTotal implements Segment {

    tag = "CNT";

    control: Control;

    constructor(data: ResultType, decimalSeparator: string) {
        this.control = new Control(data.elements[0], decimalSeparator);
    }
}

// COD

class TypeOfUnit {
    unitOrComponentTypeDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    unitOrComponentTypeDescription: string | undefined;

    constructor(data: string[]) {
        this.unitOrComponentTypeDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.unitOrComponentTypeDescription = data[3];
    }
}

class ComponentMaterial {
    componentMaterialDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    componentMaterialDescription: string | undefined;

    constructor(data: string[]) {
        this.componentMaterialDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.componentMaterialDescription = data[3];
    }
}

export class ComponentDetails implements Segment {

    tag = "COD";

    typeOfUnit: TypeOfUnit | undefined;
    componentMaterial: ComponentMaterial | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.typeOfUnit = new TypeOfUnit(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.componentMaterial = new ComponentMaterial(data.elements[1]);
        }
    }
}

// COM

class CommunicationContactData {
    communicationAddressIdentifier: string;
    communicationAddressCodeQualifier: string;

    constructor(data: string[]) {
        this.communicationAddressIdentifier = data[0];
        this.communicationAddressCodeQualifier = data[1];
    }
}

export class CommunicationContact implements Segment {

    tag = "COM";

    communicationContact: CommunicationContactData;

    constructor(data: ResultType) {
        this.communicationContact = new CommunicationContactData(data.elements[0]);
    }
}

// CPS

export class ConsignmentPackingSequence implements Segment {

    tag = "CPS";

    hierarchicalStructureLevelIdentifier: string;
    hierarchicalStructureParentIdentifier: string | undefined;
    packagingLevelCode: string | undefined;

    constructor(data: ResultType) {
        this.hierarchicalStructureLevelIdentifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.hierarchicalStructureParentIdentifier = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.packagingLevelCode = data.elements[2][0];
        }
    }
}

// CTA

class DepartmentOrEmployeeDetails {
    departmentOrEmployeeNameCode: string | undefined;
    departmentOrEmployeeName: string | undefined;

    constructor(data: string[]) {
        this.departmentOrEmployeeNameCode = data[0];
        this.departmentOrEmployeeName = data[1];
    }
}

export class ContactInformation implements Segment {

    tag = "CTA";

    contactFunctionCode: string | undefined;
    departmentOrEmployeeDetails: DepartmentOrEmployeeDetails | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.contactFunctionCode = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.departmentOrEmployeeDetails = new DepartmentOrEmployeeDetails(data.elements[1]);
        }
    }
}

// CUX

class CurrencyDetails {
    currencyUsageCodeQualifier: string;
    currencyIdentificationCode: string | undefined;
    currencyTypeCodeQualifier: string | undefined;
    currencyRate: number | undefined;

    constructor(data: string[]) {
        this.currencyUsageCodeQualifier = data[0];
        this.currencyIdentificationCode = data[1];
        this.currencyTypeCodeQualifier = data[2];
        if (data.length > 3) {
            this.currencyRate = parseInt(data[3]);
        }
    }
}

export class Currencies implements Segment {

    tag = "CUX";

    currencyDetails1: CurrencyDetails | undefined;
    currencyDetails2: CurrencyDetails | undefined;
    currencyExchangeRate: number | undefined;
    exchangeRateCurrencyMarketIdentifier: string | undefined;

    constructor(data: ResultType, decimalSymbol: string) {
        if (data.elements.length > 0) {
            this.currencyDetails1 = new CurrencyDetails(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.currencyDetails2 = new CurrencyDetails(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.currencyExchangeRate = sanitizeFloat(data.elements[2][0], decimalSymbol);
        }
        if (data.elements.length > 3) {
            this.exchangeRateCurrencyMarketIdentifier = data.elements[3][0];
        }
    }
}

// DGS

class HazardCode {
    hazardIdentificationCode: string;
    additionalHazardClassificationIdentifier: string | undefined;
    hazardCodeVersionIdentifier: string | undefined;

    constructor(data: string[]) {
        this.hazardIdentificationCode = data[0];
        this.additionalHazardClassificationIdentifier = data[1];
        this.hazardCodeVersionIdentifier = data[2];
    }
}

class UnitedNationsDagneoursGoodsInformation {
    unitedNationsangerousGoodsIdentifier: number | undefined;
    dangerousGoodsFlashpointValue: string | undefined;

    constructor(data: string[]) {
        if (data.length > 0) {
            this.unitedNationsangerousGoodsIdentifier = parseInt(data[0]);
        }
        this.dangerousGoodsFlashpointValue = data[1];
    }
}

class DangerousGoodsShipmentFlashpoint {
    shipmentFlashpointValue: number | undefined;
    measurementUnitCode: string | undefined;

    constructor(data: string[]) {
        if (data.length > 0) {
            this.shipmentFlashpointValue = parseInt(data[0]);
        }
        this.measurementUnitCode = data[1];
    }
}

class HazardIdentificationPlacardDetails {
    orangeHazardPlacardUpperPardIdentifier: string | undefined;
    orangeHazardPlacardLowerPartIdentifier: string | undefined;

    constructor(data: string[]) {
        this.orangeHazardPlacardUpperPardIdentifier = data[0];
        this.orangeHazardPlacardLowerPartIdentifier = data[1];
    }
}

class DangerousGoodsLabel {
    dangerousGoodsMarkingIdentifier1: string | undefined;
    dangerousGoodsMarkingIdentifier2: string | undefined;
    dangerousGoodsMarkingIdentifier3: string | undefined;

    constructor(data: string[]) {
        this.dangerousGoodsMarkingIdentifier1 = data[0];
        this.dangerousGoodsMarkingIdentifier2 = data[1];
        this.dangerousGoodsMarkingIdentifier3 = data[2];
    }
}

export class DangerousGoods implements Segment {

    tag = "DGS";

    dangerousGoodsRegulationsCode: string;
    hazardCode: HazardCode | undefined;
    undgInformation: UnitedNationsDagneoursGoodsInformation | undefined;
    dangerousGoodsShipmentFlashpoint: DangerousGoodsShipmentFlashpoint | undefined;
    packagingDangerLevelCode: string | undefined;
    emergencyProcedureForShipsIdentifier: string | undefined;
    hazardMedicalFirstAidGuideIdentifier: string | undefined;
    transportEmergencyCardIdentifier: string | undefined;
    hazardIdentificationPlacardDetails: HazardIdentificationPlacardDetails | undefined;
    dangerousGoodsLabel: DangerousGoodsLabel | undefined;
    packingInstructionTypeCode: string | undefined;
    hazardousMeansOfTransportCategoryCode: string | undefined;
    hazardousCargoTransportAuthorizationCode: string | undefined;

    constructor(data: ResultType) {
        this.dangerousGoodsRegulationsCode = data.elements[0][0];
        if (data.elements.length > 1) {
            this.hazardCode = new HazardCode(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.undgInformation = new UnitedNationsDagneoursGoodsInformation(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.dangerousGoodsShipmentFlashpoint = new DangerousGoodsShipmentFlashpoint(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.packagingDangerLevelCode = data.elements[4][0];
        }
        if (data.elements.length > 5) {
            this.emergencyProcedureForShipsIdentifier = data.elements[5][0];
        }
        if (data.elements.length > 6) {
            this.hazardMedicalFirstAidGuideIdentifier = data.elements[6][0];
        }
        if (data.elements.length > 7) {
            this.transportEmergencyCardIdentifier = data.elements[7][0];
        }
        if (data.elements.length > 8) {
            this.hazardIdentificationPlacardDetails = new HazardIdentificationPlacardDetails(data.elements[8]);
        }
        if (data.elements.length > 9) {
            this.dangerousGoodsLabel = new DangerousGoodsLabel(data.elements[9]);
        }
        if (data.elements.length > 10) {
            this.packingInstructionTypeCode = data.elements[10][0];
        }
        if (data.elements.length > 11) {
            this.hazardousMeansOfTransportCategoryCode = data.elements[11][0];
        }
        if (data.elements.length > 12) {
            this.hazardousCargoTransportAuthorizationCode = data.elements[12][0];
        }
    }
}

// DLM

export class DeliveryLimitations implements Segment {

    tag = "DLM";

    backOrderArrangementTypeCode: string | undefined;
    instruction: Instruction | undefined;
    specialServicesIdentification: SpecialServicesIdentification | undefined;
    substitutionConditionCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.backOrderArrangementTypeCode = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.instruction = new Instruction(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.specialServicesIdentification = new SpecialServicesIdentification(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.substitutionConditionCode = data.elements[3][0];
        }
    }
}

// DMS

export class MessageSummary implements Segment {

    tag = "DMS";

    messageIdentification: MessageIdentification | undefined;
    messageName: MessageName | undefined;
    itemTotalQuantity: number | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.messageIdentification = new MessageIdentification(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.messageName = new MessageName (data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.itemTotalQuantity = parseInt(data.elements[2][0]);
        }
    }
}

// DOC

class MessageDetailsData {
    documentIdentifer: string | undefined;
    documentStatusCode: string | undefined;
    documentSourceDescription: string | undefined;
    languageNameCode: string | undefined;
    versionIdentifier: string | undefined;
    revisionIdentifier: string | undefined;

    constructor(data: string[]) {
        this.documentIdentifer = data[0];
        this.documentStatusCode = data[1];
        this.documentSourceDescription = data[2];
        this.languageNameCode = data[3];
        this.versionIdentifier = data[4];
        this.revisionIdentifier = data[5];
    }
}

export class MessageDetails implements Segment {

    tag = "DOC";

    messageName: MessageName;
    messageDetails: MessageDetailsData | undefined;
    communicationMediumTypeCode: string | undefined;
    documentCopiesRequiredQuantity: number | undefined;
    doucmentOriginalsRequiredQuantity: number | undefined;

    constructor(data: ResultType) {
        this.messageName = new MessageName(data.elements[0]);
        if (data.elements.length > 1) {
            this.messageDetails = new MessageDetailsData(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.communicationMediumTypeCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.documentCopiesRequiredQuantity = parseInt(data.elements[3][0]);
        }
        if (data.elements.length > 4) {
            this.doucmentOriginalsRequiredQuantity =  parseInt(data.elements[4][0]);
        }
    }
}

// DTM

export class DateTimePeriod implements Segment {

    tag = "DTM";

    dateTimeOrPeriodFunctionCodeQualifier: string;
    dateTimeOrPeriodText: string | undefined;
    dateTimeOrPeriodFormatCode: string | undefined;

    constructor(data: ResultType) {
        this.dateTimeOrPeriodFunctionCodeQualifier = data.elements[0][0];
        if (data.elements[0].length > 1) {
            this.dateTimeOrPeriodText = data.elements[0][1];
        }
        if (data.elements[0].length > 2) {
            this.dateTimeOrPeriodFormatCode = data.elements[0][2];
        }
    }
}

// EFI

class FileIdentification {

    fileName: string | undefined;
    itemDescription: string | undefined;

    constructor(data: string[]) {
        this.fileName = data[0];
        this.itemDescription = data[1];
    }
}

class FileDetails {

    fileFormatName: string;
    versionIdentifier: string | undefined;
    dataFormatDescriptionCode: string | undefined;
    dataFormatDescription: string | undefined;

    constructor(data: string[]) {
        this.fileFormatName = data[0];
        this.versionIdentifier = data[1];
        this.dataFormatDescriptionCode = data[2];
        this.dataFormatDescription =  data[3];
    }
}

export class ExternalFileLinkIdentification implements Segment {

    tag = "EFI";

    fileIdentification: FileIdentification;
    fileDetails: FileDetails | undefined;
    sequencePositionIdentifier: string | undefined;
    fileCompressionTechniqueName: string | undefined;

    constructor(data: ResultType) {
        this.fileIdentification = new FileIdentification(data.elements[0]);
        if (data.elements.length > 1) {
            this.fileDetails = new FileDetails(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.sequencePositionIdentifier = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.fileCompressionTechniqueName = data.elements[3][0];
        }
    }
}

// EQA

export class AttachedEquipment implements Segment {

    tag = "EQA";

    equipmentTypeCodeQualifier: string;
    equipmentIdentification: EquipmentIdentification | undefined;

    constructor(data: ResultType) {
        this.equipmentTypeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.equipmentIdentification = new EquipmentIdentification(data.elements[1]);
        }
    }
}

// EQD

class EquipmentIdentification {
    equipmentIdentifier: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    countryNameCode: string | undefined;

    constructor(data: string[]) {
        this.equipmentIdentifier = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.countryNameCode = data[3];
    }
}

class EquipmentSizeAndType {
    equipmentSizeAndTypeDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    equipmentSizeAndTypeDescription: string | undefined;

    constructor(data: string[]) {
        this.equipmentSizeAndTypeDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.equipmentSizeAndTypeDescription = data[3];
    }
}

export class EquipmentDetails implements Segment {

    tag = "EQD";

    equipmentTypeCodeQualifier: string;
    equipmentIdentification: EquipmentIdentification | undefined;
    equipmentSizeAndType: EquipmentSizeAndType | undefined;
    equipmentSupplierCode: string | undefined;
    equipmentStatusCode: string | undefined;
    fullOrEmptyIndicatorCode: string | undefined;

    constructor(data: ResultType) {
        this.equipmentTypeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.equipmentIdentification = new EquipmentIdentification(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.equipmentSizeAndType = new EquipmentSizeAndType(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.equipmentSupplierCode = data.elements[3][0];
        }
        if (data.elements.length > 4) {
            this.equipmentStatusCode = data.elements[4][0];
        }
        if (data.elements.length > 5) {
            this.fullOrEmptyIndicatorCode = data.elements[5][0];
        }
    }
}

// ERC

class ApplicationErrorDetail {
    applicationErrorCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.applicationErrorCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

export class ApplicationErrorInformation implements Segment {

    tag = "ERC";

    applicationErrorDetail: ApplicationErrorDetail;

    constructor(data: ResultType) {
        this.applicationErrorDetail = new ApplicationErrorDetail(data.elements[0]);
    }
}

// FII

class AccountHolderIdentification {
    accountHolderIdentifier: string | undefined;
    accountHolderName: string | undefined;
    accountHolderName2: string | undefined;
    currencyIdentificationCode: string | undefined;

    constructor(data: string[]) {
        this.accountHolderIdentifier = data[0];
        this.accountHolderName = data[1];
        this.accountHolderName2 = data[2];
        this.currencyIdentificationCode = data[3];
    }
}

class InstitutionIdentification {
    institutionNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    institutionBranchIdentifier: string | undefined;
    codeListIdentificationCode2: string | undefined;
    codeListResponsibleAgencyCode2: string | undefined;
    institutionName: string | undefined;
    institutionBranchLocationName: string | undefined;

    constructor(data: string[]) {
        this.institutionNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.institutionBranchIdentifier = data[3];
        this.codeListIdentificationCode2 = data[4];
        this.codeListResponsibleAgencyCode2 = data[5];
        this.institutionName = data[6];
        this.institutionBranchLocationName = data[7];
    }
}

export class FinancialInstitutionInformation implements Segment {

    tag = "FII";

    partyFunctionCodeQualifier: string;
    accountHolderIdentification: AccountHolderIdentification | undefined;
    institutionIdentification: InstitutionIdentification | undefined;
    countryNameCode: string | undefined;

    constructor(data: ResultType) {
        this.partyFunctionCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.accountHolderIdentification = new AccountHolderIdentification(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.institutionIdentification = new InstitutionIdentification(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.countryNameCode = data.elements[3][0];
        }
    }
}

// FTX

class TextReference {
    freeTextValueCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.freeTextValueCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

class TextLiteral {
    freeTextValue1: string;
    freeTextValue2: string | undefined;
    freeTextValue3: string | undefined;
    freeTextValue4: string | undefined;
    freeTextValue5: string | undefined;

    constructor(data: string[]) {
        this.freeTextValue1 = data[0];
        this.freeTextValue2 = data[1];
        this.freeTextValue3 = data[2];
        this.freeTextValue4 = data[3];
        this.freeTextValue5 = data[4];
    }
}

export class FreeText implements Segment {

    tag = "FTX";

    textSubjectCodeQualifier: string;
    freeTextFunctionCode: string | undefined;
    textReference: TextReference | undefined;
    textLiteral: TextLiteral | undefined;
    languageNameCode: string | undefined;
    freeTextFormatCode: string | undefined;

    constructor(data: ResultType) {
        this.textSubjectCodeQualifier = data.elements[0][0];
        this.freeTextFunctionCode = data.elements[1][0];
        if (data.elements.length > 2) {
            this.textReference = new TextReference(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.textLiteral = new TextLiteral(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.languageNameCode = data.elements[4][0];
        }
        if (data.elements.length > 5) {
            this.freeTextFormatCode = data.elements[5][0];
        }
    }
}

// GEI

class ProcessingIndicator {
    processingIndicatorDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    processTypeDescriptionCode: string | undefined;

    constructor(data: string[]) {
        this.processingIndicatorDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.processTypeDescriptionCode = data[3];
    }
}

export class ProcessingInformation implements Segment {

    tag = "GEI";

    processingInformationCodeQualifier: string;
    processingIndicator: ProcessingIndicator | undefined;
    processTypeDescriptionCode: string | undefined;

    constructor(data: ResultType) {
        this. processingInformationCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.processingIndicator = new ProcessingIndicator(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.processTypeDescriptionCode = data.elements[2][0];
        }
    }
}

// GIN

class IdentityNumberRange {
    objectIdentifier1: string;
    objectIdentifier2: string | undefined;

    constructor(data: string[]) {
        this.objectIdentifier1 = data[0];
        this.objectIdentifier2 = data[1];
    }
}

export class GoodsIdentityNumber implements Segment {

    tag = "GIN";

    objectIdentificationCodeQualifier: string;
    identityNumberRange1: IdentityNumberRange;
    identityNumberRange2: IdentityNumberRange | undefined;
    identityNumberRange3: IdentityNumberRange | undefined;
    identityNumberRange4: IdentityNumberRange | undefined;
    identityNumberRange5: IdentityNumberRange | undefined;

    constructor(data: ResultType) {
        this.objectIdentificationCodeQualifier = data.elements[0][0];
        this.identityNumberRange1 = new IdentityNumberRange(data.elements[1]);
        if (data.elements.length > 2) {
            this.identityNumberRange2 = new IdentityNumberRange(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.identityNumberRange3 = new IdentityNumberRange(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.identityNumberRange4 = new IdentityNumberRange(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.identityNumberRange5 = new IdentityNumberRange(data.elements[5]);
        }
    }
}

// GIR

class IdentificationNumber {
    objectIdentifier: string;
    objectIdentificationCodeQualifier: string | undefined;
    statusDescriptionCode: string | undefined;

    constructor(data: string[]) {
        this.objectIdentifier = data[0];
        this.objectIdentificationCodeQualifier = data[1];
        this.statusDescriptionCode = data[2];
    }
}

export class RelatedInformationNumbers implements Segment {

    tag = "GIR";

    setTypeCodeQualifier: string;
    identificationNumber1: IdentificationNumber;
    identificationNumber2: IdentificationNumber | undefined;
    identificationNumber3: IdentificationNumber | undefined;
    identificationNumber4: IdentificationNumber | undefined;
    identificationNumber5: IdentificationNumber | undefined;

    constructor(data: ResultType) {
        this.setTypeCodeQualifier = data.elements[0][0];
        this.identificationNumber1 = new IdentificationNumber(data.elements[1]);
        if (data.elements.length > 2) {
            this.identificationNumber2 = new IdentificationNumber(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.identificationNumber3 = new IdentificationNumber(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.identificationNumber4 = new IdentificationNumber(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.identificationNumber5 = new IdentificationNumber(data.elements[5]);
        }
    }
}

// GIS - removed with D02B

export class GeneralIndicator implements Segment {

    tag = "GIS";

    processingIndicator: ProcessingIndicator;

    constructor(data: ResultType) {
        this.processingIndicator = new ProcessingIndicator(data.elements[0]);
    }
}

// HAN

class HandlingInstructionsData {
    handlingInstructionDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    handlingInstructionDescription: string | undefined;

    constructor(data: string[]) {
        this.handlingInstructionDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.handlingInstructionDescription = data[3];
    }
}

class HazardousMaterial {
    hazardousMaterialCategoryNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    hazardousMaterialCategoryName: string | undefined;

    constructor(data: string[]) {
        this.hazardousMaterialCategoryNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.hazardousMaterialCategoryName = data[3];
    }
}

export class HandlingInstructions implements Segment {

    tag = "HAN";

    handlingInstructions: HandlingInstructionsData | undefined;
    hazardousMaterial: HazardousMaterial | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.handlingInstructions = new HandlingInstructionsData(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.hazardousMaterial =  new HazardousMaterial(data.elements[1]);
        }
    }
}

// HYN

export class HierarchyInformation implements Segment {

    tag = "HYN";

    hierarchyObjectCodeQualifier: string;
    hierarchicalStructureRelationshipCode: string | undefined;
    actionCode: string | undefined;
    itemNumberIdentification: ItemNumberIdentification | undefined;
    hierarchicalStructureParentIdentifier: string | undefined;

    constructor(data: ResultType) {
        this.hierarchyObjectCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.hierarchicalStructureRelationshipCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.actionCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.itemNumberIdentification = new ItemNumberIdentification(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.hierarchicalStructureParentIdentifier = data.elements[4][0];
        }
    }
}

// IDE

class PositionIdentification {
    hierarchicalStructureLevelIdentifier: string | undefined;
    sequencePositionIdentifier: string | undefined;

    constructor(data: string[]) {
        this.hierarchicalStructureLevelIdentifier = data[0];
        this.sequencePositionIdentifier = data[1];
    }
}

export class Identity implements Segment {

    tag = "IDE";

    objectTypeCodeQualifier: string;
    identificationNumber: IdentificationNumber | undefined;
    partyIdentificationDetails: PartyIdentificationDetails | undefined;
    statusDescriptionCode: string | undefined;
    configurationLevelNumber: number | undefined;
    positionIdentification: PositionIdentification | undefined;
    characteristicDescription: CharacteristicDescription | undefined;

    constructor(data: ResultType) {
        this.objectTypeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.identificationNumber = new IdentificationNumber(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.partyIdentificationDetails = new PartyIdentificationDetails(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.statusDescriptionCode = data.elements[3][0];
        }
        if (data.elements.length > 4) {
            this.configurationLevelNumber = parseInt(data.elements[4][0]);
        }
        if (data.elements.length > 5) {
            this.positionIdentification = new PositionIdentification(data.elements[5]);
        }
        if (data.elements.length > 6) {
            this.characteristicDescription = new CharacteristicDescription(data.elements[6]);
        }
    }
}

// IMD

class ItemCharacteristic {
    itemCharacteristicCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.itemCharacteristicCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

class ItemDescriptionData {
    itemDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    itemDescription: string | undefined;
    itemDescription2: string | undefined;
    languageNameCode: string | undefined;

    constructor(data: string[]) {
        this.itemDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode =  data[2];
        this.itemDescription = data[3];
        this.itemDescription2 = data[4];
        this.languageNameCode = data[5];
    }
}

export class ItemDescription implements Segment {

    tag = "IMD";

    descriptionFormatCode: string | undefined;
    itemCharacteristic: ItemCharacteristic | undefined;
    itemDescription: ItemDescriptionData | undefined;
    surfaceOrLayerCode:  string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.descriptionFormatCode = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.itemCharacteristic = new ItemCharacteristic(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.itemDescription = new ItemDescriptionData(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.surfaceOrLayerCode = data.elements[3][0];
        }
    }
}

// INP

class PartiesToInstruction {
    enactingPartyIdentifier: string;
    instructionReceivingPartyIdentifier: string | undefined;

    constructor(data: string[]) {
        this.enactingPartyIdentifier = data[0];
        this.instructionReceivingPartyIdentifier = data[1];
    }
}

class Instruction {
    instructionTypeCodeQualifier: string;
    instructionDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    instructionDescription: string | undefined;

    constructor(data: string[]) {
        this.instructionTypeCodeQualifier = data[0];
        this.instructionDescriptionCode = data[1];
        this.codeListIdentificationCode = data[2];
        this.codeListResponsibleAgencyCode = data[3];
        this.instructionDescription = data[4];
    }
}

class StatusOfInstruction {
    statusDescriptionCode: string;
    partyName: string | undefined;

    constructor(data: string[]) {
        this.statusDescriptionCode = data[0];
        this.partyName = data[1];
    }
}

export class PartiesAndInstruction implements Segment {

    tag = "INP";

    partiesToInstruction: PartiesToInstruction | undefined;
    instruction: Instruction | undefined;
    statusOfInstruction: StatusOfInstruction | undefined;
    actionRequestNotificationDescriptionCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.partiesToInstruction = new PartiesToInstruction(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.instruction = new Instruction(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.statusOfInstruction = new StatusOfInstruction(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.actionRequestNotificationDescriptionCode = data.elements[3][0];
        }
    }
}

// IRQ

class InformationRequest {
    requestInformationDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    requestInformationDescription: string | undefined;

    constructor(data: string[]) {
        this.requestInformationDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.requestInformationDescription = data[3];
    }
}

export class InformationRequired implements Segment {

    tag = "IRQ";

    informationRequest: InformationRequest;

    constructor(data: ResultType) {
        this.informationRequest = new InformationRequest(data.elements[0]);
    }
}

// LIN

class ItemNumberIdentification {

    itemIdentifier: string | undefined;
    itemTypeIdentificationCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.itemIdentifier = data[0];
        this.itemTypeIdentificationCode = data[1];
        this.codeListIdentificationCode = data[2];
        this.codeListResponsibleAgencyCode = data[3];
    }
}

class SubLineInformation {
    subLineIndicatorCode: string | undefined;
    lineItemIdentifier: string | undefined;

    constructor(data: string[]) {
        this.subLineIndicatorCode = data[0];
        this.lineItemIdentifier = data[1];
    }
}

export class LineItem implements Segment {

    tag = "LIN";

    lineItemIdendifier: string | undefined;
    actionRequestNotificationDescriptionCode: string | undefined; // renamed to action code in D06a
    itemNumberIdentification: ItemNumberIdentification | undefined;
    subLineInformatin: SubLineInformation | undefined;
    configurationLevelNumber: number | undefined;
    configurationOperationCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.lineItemIdendifier = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.actionRequestNotificationDescriptionCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.itemNumberIdentification = new ItemNumberIdentification(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.subLineInformatin = new SubLineInformation(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.configurationLevelNumber = parseInt(data.elements[4][0]);
        }
        if (data.elements.length > 5) {
            this.configurationOperationCode = data.elements[5][0];
        }
    }
}

// LOC

class LocationIdentificationData {
    locationNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    locationName: string | undefined;

    constructor(data: string[]) {
        this.locationNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.locationName = data[3];
    }
}

class RelatedLocationOneIdentification {
    firstRelatedLocationNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    firstRelatedLocationName: string | undefined;

    constructor(data: string[]) {
        this.firstRelatedLocationNameCode = data[0];
        this.codeListIdentificationCode =  data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.firstRelatedLocationName = data[3];
    }
}

class RelatedLocationTwoIdentification {
    secondRelatedLocationNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    secondRelatedLocationName: string | undefined;

    constructor(data: string[]) {
        this.secondRelatedLocationNameCode = data[0];
        this.codeListIdentificationCode =  data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.secondRelatedLocationName = data[3];
    }
}

export class LocationIdentification implements Segment {

    tag = "LOC";

    locationFunctionCodeQualifier: string;
    locationIdentification: LocationIdentificationData | undefined;
    relatedLocationOneIdentification: RelatedLocationOneIdentification | undefined;
    relatedLocationTwoIdentification: RelatedLocationTwoIdentification | undefined;
    relationCode: string | undefined;

    constructor(data: ResultType) {
        this.locationFunctionCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.locationIdentification = new LocationIdentificationData(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.relatedLocationOneIdentification = new RelatedLocationOneIdentification(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.relatedLocationTwoIdentification = new RelatedLocationTwoIdentification(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.relationCode = data.elements[4][0];
        }
    }
}

// MEA

class MeasurementDetails {
    measuredAttributeCode: string | undefined;
    measurementSignificanceCode: string | undefined;
    nonDiscreteMeasurementNameCode: string | undefined;
    nonDiscreteMeasurementName: string | undefined;

    constructor(data: string[]) {
        this.measuredAttributeCode = data[0];
        this.measurementSignificanceCode = data[1];
        this.nonDiscreteMeasurementNameCode = data[2];
        this.nonDiscreteMeasurementName = data[3];
    }
}

class ValueRange {
    measurementUnitCode: string | undefined;
    measure: string | undefined;
    rangeMinimumQuantity: number | undefined;
    rangeMaximumQuantity: number | undefined;
    significantDigitsQuantity: number | undefined;

    constructor(data: string[]) {
        this.measurementUnitCode = data[0];
        this.measure = data[1];
        if (data.length > 2) {
            this.rangeMinimumQuantity = parseInt(data[2]);
        }
        if (data.length > 3) {
            this.rangeMaximumQuantity = parseInt(data[3]);
        }
        if (data.length > 4) {
            this.significantDigitsQuantity = parseInt(data[4]);
        }
    }
}

export class Measurements implements Segment {

    tag = "MEA";

    measurementPurposeCodeQualifier: string;
    measurementDetails: MeasurementDetails | undefined;
    valueRange: ValueRange | undefined;
    surfaceOrLayerCode: string | undefined;

    constructor(data: ResultType) {
        this.measurementPurposeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.measurementDetails = new MeasurementDetails(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.valueRange = new ValueRange(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.surfaceOrLayerCode = data.elements[3][0];
        }
    }
}

// MOA

class MonetaryAmountData {
    monetaryAmountTypeCodeQualifier: string;
    monetaryAmount: number | undefined;
    currencyIdentificationCode: string | undefined;
    currencyTypeCodeQualifier: string | undefined;
    statusDescriptionCode: string | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.monetaryAmountTypeCodeQualifier = data[0];
        if (data.length > 1) {
            this.monetaryAmount = sanitizeFloat(data[1], decimalSeparator);
        }
        this.currencyIdentificationCode = data[2];
        this.currencyTypeCodeQualifier = data[3];
        this.statusDescriptionCode = data[4];
    }
}

export class MonetaryAmount implements Segment {

    tag = "MOA";

    monetaryAmount: MonetaryAmountData;

    constructor(data: ResultType, decimalSeparator: string) {
        this.monetaryAmount = new MonetaryAmountData(data.elements[0], decimalSeparator);
    }
}

// MTD

export class MaintenanceOperationDetails implements Segment {

    tag = "MTD";

    objectTypeCodeQualifier: string;
    maintenanceOperationCode: string | undefined;
    maintenanceOperationOperatorCode: string | undefined;
    maintenanceOperationPayerCode: string | undefined;

    constructor(data: ResultType) {
        this.objectTypeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.maintenanceOperationCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.maintenanceOperationOperatorCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.maintenanceOperationPayerCode = data.elements[3][0];
        }
    }
}

// NAD

class PartyIdentificationDetails {
    partyIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.partyIdentifier = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

class NameAndAddressData {
    nameAndAddressDescription1: string;
    nameAndAddressDescription2: string | undefined;
    nameAndAddressDescription3: string | undefined;
    nameAndAddressDescription4: string | undefined;
    nameAndAddressDescription5: string | undefined;

    constructor(data: string[]) {
        this.nameAndAddressDescription1 = data[0];
        this.nameAndAddressDescription2 = data[1];
        this.nameAndAddressDescription3 = data[2];
        this.nameAndAddressDescription4 = data[3];
        this.nameAndAddressDescription5 = data[4];
    }
}

class PartyName {
    partyName1: string;
    partyName2: string | undefined;
    partyName3: string | undefined;
    partyName4: string | undefined;
    partyName5: string | undefined;
    partyNameFormatCode: string | undefined;

    constructor(data: string[]) {
        this.partyName1 = data[0];
        this.partyName2 = data[1];
        this.partyName3 = data[2];
        this.partyName4 = data[3];
        this.partyName5 = data[4];
        this.partyNameFormatCode = data[5];
    }
}

class Street {
    streetAndNumberOrPostOfficeBoxIdentifier1: string;
    streetAndNumberOrPostOfficeBoxIdentifier2: string | undefined;
    streetAndNumberOrPostOfficeBoxIdentifier3: string | undefined;
    streetAndNumberOrPostOfficeBoxIdentifier4: string | undefined;

    constructor(data: string[]) {
        this.streetAndNumberOrPostOfficeBoxIdentifier1 = data[0];
        this.streetAndNumberOrPostOfficeBoxIdentifier2 = data[1];
        this.streetAndNumberOrPostOfficeBoxIdentifier3 = data[2];
        this.streetAndNumberOrPostOfficeBoxIdentifier4 = data[3];
    }
}

class CountrySubEntityDetails {
    countrySubEntityNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    countrySubEntityName: string | undefined;

    constructor(data: string[]) {
        this.countrySubEntityNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.countrySubEntityName = data[3];
    }
}

export class NameAndAddress implements Segment {

    tag = "NAD";

    partyFunctionCodeQualifier: string;
    partyIdentificationDetails: PartyIdentificationDetails | undefined;
    nameAndAddress: NameAndAddressData | undefined;
    partyName: PartyName | undefined;
    street: Street | undefined;
    cityName: string | undefined;
    countrySubEntityDetails: CountrySubEntityDetails | undefined;
    postalIdentificationCode: string | undefined;
    countryNameCode: string | undefined;

    constructor(data: ResultType) {
        this.partyFunctionCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.partyIdentificationDetails = new PartyIdentificationDetails(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.nameAndAddress = new NameAndAddressData(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.partyName = new PartyName(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.street = new Street(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.cityName = data.elements[5][0];
        }
        if (data.elements.length > 6) {
            this.countrySubEntityDetails = new CountrySubEntityDetails(data.elements[6]);
        }
        if (data.elements.length > 7) {
            this.postalIdentificationCode = data.elements[7][0];
        }
        if (data.elements.length > 8) {
            this.countryNameCode = data.elements[8][0];
        }
    }
}

// PAC

class PackagingDetails {

    packagingLevelCode: string | undefined;
    packagingRelatedDescriptionCode: string | undefined;
    packagingTermsAndConditionsCode: string | undefined;

    constructor(data: string[]) {
        this.packagingLevelCode = data[0];
        this.packagingRelatedDescriptionCode = data[1];
        this.packagingTermsAndConditionsCode = data[2];
    }
}

class PackageType {
    packageTypeDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    typeOfPackages: string | undefined;

    constructor(data: string[]) {
        this.packageTypeDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.typeOfPackages = data[3];
    }
}

class PackageTypeIdentification {

    descriptionFormatCode: string;
    typeOfPackages: string;
    itemTypeIdentificationCode: string | undefined;
    typeOfPackages2: string | undefined;
    itemTypeIdentificationCode2: string | undefined;

    constructor(data: string[]) {
        this.descriptionFormatCode = data[0];
        this.typeOfPackages = data[1];
        this.itemTypeIdentificationCode = data[2];
        this.typeOfPackages2 = data[3];
        this.itemTypeIdentificationCode2 = data[4];
    }
}

class ReturnablePackageDetails {

    returnablePackageFreightPaymentResponsibilityCode: string | undefined;
    returnablePackageLoadContentsCode: string | undefined;

    constructor(data: string[]) {
        this.returnablePackageFreightPaymentResponsibilityCode = data[0];
        this.returnablePackageLoadContentsCode = data[1];
    }
}

export class Package implements Segment {

    tag = "PAC";

    packageQuantity: number | undefined;
    packagingDetails: PackagingDetails | undefined;
    packageType: PackageType | undefined;
    packageTypeIdentification: PackageTypeIdentification | undefined;
    returnablePackageDetails: ReturnablePackageDetails | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.packageQuantity = parseInt(data.elements[0][0]);
        }
        if (data.elements.length > 1) {
            this.packagingDetails = new PackagingDetails(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.packageType = new PackageType(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.packageTypeIdentification = new PackageTypeIdentification(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.returnablePackageDetails = new ReturnablePackageDetails(data.elements[4]);
        }
    }
}

// PAI

export class PaymentInstructions implements Segment {

    tag = "PAI";

    paymendConditionsCode: string | undefined;
    paymentGuaranteeMeansCode: string | undefined;
    paymentMeansCode: string | undefined;
    codeListIdentificatinCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    paymentChannelCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 1) {
            this.paymendConditionsCode = data.elements[0][0];
        }
        if (data.elements.length > 2) {
            this.paymentGuaranteeMeansCode = data.elements[1][0];
        }
        if (data.elements.length > 3) {
            this.paymentMeansCode = data.elements[2][0];
        }
        if (data.elements.length > 4) {
            this.codeListIdentificatinCode = data.elements[3][0];
        }
        if (data.elements.length > 5) {
            this.codeListResponsibleAgencyCode = data.elements[4][0];
        }
        if (data.elements.length > 6) {
            this.paymentChannelCode = data.elements[5][0];
        }
    }
}

// PAT - removed with D02B

class PATPaymentTerms {
    paymentTermsDescriptionIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    paymentTermsDescription1: string | undefined;
    paymentTermsDescription2: string | undefined;

    constructor(data: string[]) {
        this.paymentTermsDescriptionIdentifier = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.paymentTermsDescription1 = data[3];
        this.paymentTermsDescription2 = data[4];
    }
}

class TermsTimeInformation {
    timeReferenceCode: string;
    termsTimeRelationCode: string | undefined;
    periodTypeCode: string | undefined;
    periodCountQuality: number | undefined;

    constructor(data: string[]) {
        this.timeReferenceCode = data[0];
        this.termsTimeRelationCode = data[1];
        this.periodTypeCode = data[2];
        if (data.length > 3) {
            this.periodCountQuality = parseInt(data[3]);
        }
    }
}

export class PaymentTermsBasis implements Segment {

    tag = "PAT";

    paymentTermsTypeCodeQualifier: string;
    paymentTerms: PATPaymentTerms | undefined;
    termsTimeInformation: TermsTimeInformation | undefined;

    constructor(data: ResultType) {
        this.paymentTermsTypeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.paymentTerms = new PATPaymentTerms(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.termsTimeInformation = new TermsTimeInformation(data.elements[2]);
        }
    }
}

// PCD

class PercentageDetailsData {
    percentageTypeCodeQualifier: string;
    percentage: number | undefined;
    percentageBasisIdentificationCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.percentageTypeCodeQualifier = data[0];
        if (data.length > 1) {
            this.percentage = sanitizeFloat(data[1], decimalSeparator);
        }
        this.percentageBasisIdentificationCode = data[2];
        this.codeListIdentificationCode = data[3];
        this.codeListResponsibleAgencyCode = data[4];
    }
}

export class PercentageDetails implements Segment {

    tag = "PCD";

    percentageDetails: PercentageDetailsData;
    statusDescriptionCode: string | undefined;

    constructor(data: ResultType, decimalSeparator: string) {
        this.percentageDetails = new PercentageDetailsData(data.elements[0], decimalSeparator);
        if (data.elements.length > 1) {
            this.statusDescriptionCode = data.elements[1][0];
        }
    }
}

// PCI

class MarksAndLabels {
    shippingMarksDescription1: string;
    shippingMarksDescription2: string | undefined;
    shippingMarksDescription3: string | undefined;
    shippingMarksDescription4: string | undefined;
    shippingMarksDescription5: string | undefined;
    shippingMarksDescription6: string | undefined;
    shippingMarksDescription7: string | undefined;
    shippingMarksDescription8: string | undefined;
    shippingMarksDescription9: string | undefined;
    shippingMarksDescription10: string | undefined;

    constructor(data: string[]) {
        this.shippingMarksDescription1 = data[0];
        this.shippingMarksDescription2 = data[1];
        this.shippingMarksDescription3 = data[2];
        this.shippingMarksDescription4 = data[3];
        this.shippingMarksDescription5 = data[4];
        this.shippingMarksDescription6 = data[5];
        this.shippingMarksDescription7 = data[6];
        this.shippingMarksDescription8 = data[7];
        this.shippingMarksDescription9 = data[8];
        this.shippingMarksDescription10 = data[9];
    }
}

class TypeOfMarking {
    markingTypeCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.markingTypeCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

export class PackageIdentification implements Segment {

    tag = "PCI";

    markingInstructionCode: string | undefined;
    marksAndLabels: MarksAndLabels | undefined;
    containerOrPackageContentsIndicatorCode: string | undefined;
    typeOfMarking: TypeOfMarking | undefined;

    constructor(data: ResultType) {
        this.markingInstructionCode = data.elements[0][0];
        if (data.elements.length > 1) {
            this.marksAndLabels = new MarksAndLabels(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.containerOrPackageContentsIndicatorCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.typeOfMarking = new TypeOfMarking(data.elements[3]);
        }
    }
}

// PGI

class ProductGroup {

    productGroupNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    productGroupName: string | undefined;

    constructor(data: string[]) {
        this.productGroupNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.productGroupName = data[3];
    }
}

export class ProductGroupInformation implements Segment {

    tag = "PGI";

    productGroupTypeCode: string;
    productGroup: ProductGroup | undefined;

    constructor(data: ResultType) {
        this.productGroupTypeCode = data.elements[0][0];
        if (data.elements.length > 1) {
            this.productGroup = new ProductGroup(data.elements[1]);
        }
    }
}

// PIA

export class AdditionalProductId implements Segment {

    tag = "PIA";

    productIdentifierCodeQualifier: string;

    itemNumberIdentification1: ItemNumberIdentification;
    itemNumberIdentification2: ItemNumberIdentification | undefined;
    itemNumberIdentification3: ItemNumberIdentification | undefined;
    itemNumberIdentification4: ItemNumberIdentification | undefined;
    itemNumberIdentification5: ItemNumberIdentification | undefined;

    constructor(data: ResultType) {
        this.productIdentifierCodeQualifier = data.elements[0][0];

        this.itemNumberIdentification1 = new ItemNumberIdentification(data.elements[1]);
        if (data.elements.length > 2) {
            this.itemNumberIdentification2 = new ItemNumberIdentification(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.itemNumberIdentification3 = new ItemNumberIdentification(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.itemNumberIdentification4 = new ItemNumberIdentification(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.itemNumberIdentification5 = new ItemNumberIdentification(data.elements[5]);
        }
    }
}

// PRI

class PriceInformation {

    priceCodeQualifier: string;
    priceAmount: number | undefined;
    priceTypeCode: string | undefined;
    priceSpecificationCode: string | undefined;
    unitPriceBasisValue: number | undefined;
    measurementUnitCode: string | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.priceCodeQualifier = data[0];
        if (data.length > 1) {
            this.priceAmount = sanitizeFloat(data[1], decimalSeparator);
        }
        this.priceTypeCode = data[2];
        this.priceSpecificationCode = data[3];
        if (data.length > 4) {
            this.unitPriceBasisValue = sanitizeFloat(data[4], decimalSeparator);
        }
        this.measurementUnitCode = data[5];
    }
}

export class PriceDetails implements Segment {

    tag = "PRI";

    priceInformation: PriceInformation | undefined;
    subLineItemPriceChangeOperationCode: string | undefined;

    constructor(data: ResultType, decimalSeparator: string) {
        if (data.elements.length > 0) {
            this.priceInformation = new PriceInformation(data.elements[0], decimalSeparator);
        }
        if (data.elements.length > 1) {
            this.subLineItemPriceChangeOperationCode = data.elements[1][0];
        }
    }
}

// PYT

class PaymentTermsData {
    paymentTermsDescriptionIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    paymentTermsDescription: string | undefined;

    constructor(data: string[]) {
        this.paymentTermsDescriptionIdentifier = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.paymentTermsDescription = data[3];
    }
}

export class PaymentTerms implements Segment {

    tag = "PYT";

    paymentTermsTypeCodeQualifier: string;
    paymentTerms: PaymentTermsData | undefined;
    eventTimeReferenceCode: string | undefined;
    termsTimeRelationCode: string | undefined;
    periodTypeCode: string | undefined;
    periodCountQuantity: number | undefined;

    constructor(data: ResultType) {
        this.paymentTermsTypeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.paymentTerms =  new PaymentTermsData(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.eventTimeReferenceCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.termsTimeRelationCode = data.elements[3][0];
        }
        if (data.elements.length > 4) {
            this.periodTypeCode = data.elements[4][0];
        }
        if (data.elements.length > 5) {
            this.periodCountQuantity = parseInt(data.elements[5][0]);
        }
    }
}

// QTY

class QuantityDetails {
    quantityTypeCodeQualifier: string;
    quantity: string;
    measurementUnitCode: string | undefined;

    constructor(data: string[]) {
        this.quantityTypeCodeQualifier = data[0];
        this.quantity = data[1];
        this.measurementUnitCode = data[2];
    }
}

export class Quantity implements Segment {

    tag = "QTY";

    quantityDetails: QuantityDetails;

    constructor(data: ResultType) {
        this.quantityDetails = new QuantityDetails(data.elements[0]);
    }
}

// QVR

class QuantityDifferenceInformation {
    varianceQuantity: number;
    quantityTypeCodeQualifier: string | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.varianceQuantity = sanitizeFloat(data[0], decimalSeparator);
        this.quantityTypeCodeQualifier = data[1];
    }
}

export class QuantityVariances implements Segment {

    tag = "QVR";

    quantityDifferenceInformation: QuantityDifferenceInformation | undefined;
    discrepancyNatureIdentificationCode: string | undefined;
    reasonForChange: ReasonForChange | undefined;

    constructor(data: ResultType, decimalSeparator: string) {
        if (data.elements.length > 0) {
            this.quantityDifferenceInformation = new QuantityDifferenceInformation(data.elements[0], decimalSeparator);
        }
        if (data.elements.length > 1) {
            this.discrepancyNatureIdentificationCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.reasonForChange = new ReasonForChange(data.elements[2]);
        }
    }
}

// RCS

class RequirementOrConditionIdentification {
    requirementOrConditionDescriptionIdentifier: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    requirementOrConditionDescription: string | undefined;

    constructor(data: string[]) {
        this.requirementOrConditionDescriptionIdentifier = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.requirementOrConditionDescription = data[3];
    }
}

export class RequirementsAndConditions implements Segment {

    tag = "RCS";

    sectorAreaIdentificationCodeQualifier: string;
    requirementOrConditionIdentification: RequirementOrConditionIdentification | undefined;
    actionRequestNotificationDescriptionCode: string | undefined;
    countryNameCode: string | undefined;

    constructor(data: ResultType) {
        this.sectorAreaIdentificationCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.requirementOrConditionIdentification = new RequirementOrConditionIdentification(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.actionRequestNotificationDescriptionCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.countryNameCode = data.elements[3][0];
        }
    }
}

// RFF

class ReferenceData {

    referenceCodeQualifier: string;
    referenceIdentifier: string | undefined;
    documentLineIdentifier: string | undefined;
    referenceVersionIdentifier: string | undefined;
    revisionIdentifier: string | undefined;

    constructor(data: string[]) {
        this.referenceCodeQualifier = data[0];
        this.referenceIdentifier = data[1];
        this.documentLineIdentifier = data[2];
        this.referenceVersionIdentifier = data[3];
        this.revisionIdentifier = data[4];
    }
}

export class Reference implements Segment {

    tag = "RFF";

    reference: ReferenceData;

    constructor(data: ResultType) {
        this.reference = new ReferenceData(data.elements[0]);
    }
}

// RJL

class AccountingJournalIdentificationData {
    accountingJournalIdentification: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    accountingJournalName: string | undefined;

    constructor(data: string[]) {
        this.accountingJournalIdentification = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.accountingJournalName = data[3];
    }
}

class AccountingEntryTypeDetails {
    accountingEntryTypeNameCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    accountingEntryTypeName: string | undefined;

    constructor(data: string[]) {
        this.accountingEntryTypeNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.accountingEntryTypeName = data[3];
    }
}

export class AccountingJournalIdentification implements Segment {

    tag = "RJL";

    accountingJournalIdentification: AccountingJournalIdentificationData | undefined;
    accountingEntryTypeDetails: AccountingEntryTypeDetails | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.accountingJournalIdentification = new AccountingJournalIdentificationData(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.accountingEntryTypeDetails = new AccountingEntryTypeDetails(data.elements[1]);
        }
    }
}

// RNG

class Range {
    measurementUnitCode: string;
    rangeMinimumValue: number | undefined;
    rangeMaximumValue: number | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.measurementUnitCode = data[0];
        this.rangeMinimumValue = sanitizeFloat(data[1], decimalSeparator);
        this.rangeMaximumValue = sanitizeFloat(data[2], decimalSeparator);
    }
}

export class RangeDetails implements Segment {

    tag = "RNG";

    rangeTypeCodeQualifier: string;
    range: Range | undefined;

    constructor(data: ResultType, decimalSeparator: string) {
        this.rangeTypeCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.range = new Range(data.elements[1], decimalSeparator);
        }
    }
}

// RTE

class RateDetailsData {
    rateTypeCodeQualifier: string;
    unitPriceBasisRate: number;
    unitPriceBasisValue: number | undefined;
    measurementUnitCode: string | undefined;

    constructor(data: string[], decimalSeparator: string) {
        this.rateTypeCodeQualifier = data[0];
        this.unitPriceBasisRate = sanitizeFloat(data[1], decimalSeparator);
        this.unitPriceBasisValue = sanitizeFloat(data[2], decimalSeparator);
        this.measurementUnitCode = data[3];
    }
}

export class RateDetails implements Segment {

    tag = "RTE";

    rateDetails: RateDetailsData;
    statusDescriptionCode: string | undefined;

    constructor(data: ResultType, decimalSeparator: string) {
        this.rateDetails = new RateDetailsData(data.elements[0], decimalSeparator);
        if (data.elements.length > 1) {
            this.statusDescriptionCode = data.elements[1][0];
        }
    }
}

// SEL

class SealIssuer {
    sealingPartyNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    sealingPartyName: string | undefined;

    constructor(data: string[]) {
        this.sealingPartyNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.sealingPartyName = data[3];
    }
}

export class SealNumber implements Segment {

    tag = "SEL";

    sealIdentifier: string | undefined;
    sealIssuer: SealIssuer | undefined;
    sealConditionCode: string | undefined;
    identityNumberRange: IdentityNumberRange | undefined;

    constructor(data: ResultType) {
        this.sealIdentifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.sealIssuer = new SealIssuer(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.sealConditionCode = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.identityNumberRange = new IdentityNumberRange(data.elements[3]);
        }
    }
}

// SCC

class PatternDescription {
    frequencyCode: string | undefined;
    despatchPatternCode: string | undefined;
    despatchPatternTimingCode: string | undefined;

    constructor(data: string[]) {
        this.frequencyCode = data[0];
        this.despatchPatternCode = data[1];
        this.despatchPatternTimingCode = data[2];
    }
}

export class SchedulingConditions implements Segment {

    tag = "SCC";

    deliveryPlanCommitmentLevelCode: string;
    deliveryInstructionCode: string | undefined;
    patternDescription: PatternDescription | undefined;

    constructor(data: ResultType) {
        this.deliveryPlanCommitmentLevelCode = data.elements[0][0];
        if (data.elements.length > 1) {
            this.deliveryInstructionCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.patternDescription = new PatternDescription(data.elements[2]);
        }
    }
}

// SEQ

class SequenceInformation {
    sequencePositionIdentifier: string;
    sequenceIdentifierSoruceCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.sequencePositionIdentifier = data[0];
        this.sequenceIdentifierSoruceCode = data[1];
        this.codeListIdentificationCode = data[2];
        this.codeListResponsibleAgencyCode = data[3];
    }
}

export class SequenceDetails implements Segment {

    tag = "SEQ";

    actionCode: string | undefined;
    sequenceInformation: SequenceInformation | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.actionCode = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.sequenceInformation = new SequenceInformation(data.elements[1]);
        }
    }
}

// SGP

export class SplitGoodsPlacement implements Segment {

    tag = "SGP";

    equipmentIdentification: EquipmentIdentification;
    packageQuantity: number | undefined;

    constructor(data: ResultType) {
        this.equipmentIdentification = new EquipmentIdentification(data.elements[0]);
        if (data.elements.length > 1) {
            this.packageQuantity = parseInt(data.elements[1][0]);
        }
    }
}

// STS

class StatusCategory {
    statusCategoryCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.statusCategoryCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

class StatusData {
    statusDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    statusDescription: string | undefined;

    constructor(data: string[]) {
        this.statusDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.statusDescription = data[3];
    }
}

class StatusReason {
    statusReasonDescriptionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    statusReasonDescription: string | undefined;

    constructor(data: string[]) {
        this.statusReasonDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.statusReasonDescription = data[3];
    }
}

export class Status implements Segment {

    tag = "STS";

    statusCategory: StatusCategory | undefined;
    status: StatusData | undefined;
    statusReason1: StatusReason | undefined;
    statusReason2: StatusReason | undefined;
    statusReason3: StatusReason | undefined;
    statusReason4: StatusReason | undefined;
    statusReason5: StatusReason | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.statusCategory = new StatusCategory(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.status = new StatusData(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.statusReason1 = new StatusReason(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.statusReason2 = new StatusReason(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.statusReason3 = new StatusReason(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.statusReason4 = new StatusReason(data.elements[5]);
        }
        if (data.elements.length > 6) {
            this.statusReason5 = new StatusReason(data.elements[6]);
        }
    }
}

// TAX

class DutyTaxOrFeeType {

    dutyTaxOrFeeTypeNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    dutyTaxOrFreeTypeName: string | undefined;

    constructor(data: string[]) {
        this.dutyTaxOrFeeTypeNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.dutyTaxOrFreeTypeName = data[3];
    }
}

class DutyTaxOrFeeAccountDetail {
    dutyTaxOrFeeTypeNameCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.dutyTaxOrFeeTypeNameCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

class DutyTaxOrFeeDetail {
    dutyTaxOrFeeRateDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    dutyTaxOrFeeRateDescription: string | undefined;
    dutyTaxOrFeeRateBasisCode: string | undefined;
    codeListIdentificationCode2: string | undefined;
    codeListResponsibleAgencyCode2: string | undefined;

    constructor(data: string[]) {
        this.dutyTaxOrFeeRateDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.dutyTaxOrFeeRateDescription = data[3];
        this.dutyTaxOrFeeRateBasisCode = data[4];
        this.codeListIdentificationCode2 = data[5];
        this.codeListResponsibleAgencyCode2 = data[6];
    }
}

export class TaxDetails implements Segment {

    tag = "TAX";

    dutyTaxOrFeeFunctionCodeQualifier: string;
    dutyTaxOrFeeType: DutyTaxOrFeeType | undefined;
    dutyTaxOrFeeAcountDetail: DutyTaxOrFeeAccountDetail | undefined;
    dutyTaxOrFreeAssessmentBasisValue: string | undefined;
    dutyTaxOrFeeDetail: DutyTaxOrFeeDetail | undefined;
    dutyTaxOrFeeCategoryCode: string | undefined;
    partyTaxIdentifier: string | undefined;
    calculationSequenceCode: string | undefined;

    constructor(data: ResultType) {

        this.dutyTaxOrFeeFunctionCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.dutyTaxOrFeeType = new DutyTaxOrFeeType(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.dutyTaxOrFeeAcountDetail = new DutyTaxOrFeeAccountDetail(data.elements[2]);
        }
        this.dutyTaxOrFreeAssessmentBasisValue = data.elements[3][0];
        if (data.elements.length > 4) {
            this.dutyTaxOrFeeDetail = new DutyTaxOrFeeDetail(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.dutyTaxOrFeeCategoryCode = data.elements[5][0];
        }
        if (data.elements.length > 6) {
            this.partyTaxIdentifier = data.elements[6][0];
        }
        if (data.elements.length > 7) {
            this.calculationSequenceCode = data.elements[7][0];
        }
    }
}

// TDT

class ModeOfTransport {
    transportModeNameCode: string | undefined;
    transportModeName: string | undefined;

    constructor(data: string[]) {
        this.transportModeNameCode = data[0];
        this.transportModeName = data[1];
    }
}

class TransportMeans {
    transportMeansDescriptionCode: string | undefined;
    transportMeansDescription: string | undefined;

    constructor(data: string[]) {
        this.transportMeansDescriptionCode = data[0];
        this.transportMeansDescription = data[1];
    }
}

class TransportMeansD02b {
    transportMeansDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    transportMeansDescription: string | undefined;

    constructor(data: string[]) {
        this.transportMeansDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.transportMeansDescription = data[3];
    }
}

class Carrier {
    carrierIdentifier: string | undefined;
    codeListIdentificationcode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    carrierName: string | undefined;

    constructor(data: string[]) {
        this.carrierIdentifier = data[0];
        this.codeListIdentificationcode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.carrierName = data[3];
    }
}

class ExcessTransportationInformation {
    excessTransportationReasonCode: string;
    excessTransportationResponsibilityCode: string;
    customerShipmentAuthorisationIdentifier: string | undefined;

    constructor(data: string[]) {
        this.excessTransportationReasonCode = data[0];
        this.excessTransportationResponsibilityCode = data[1];
        this.customerShipmentAuthorisationIdentifier = data[2];
    }
}

class TransportIdentification {
    transportMeansIdentificationNameIdentifier: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    transportMeansIdentificationName: string | undefined;
    transportMeansNationalityCode: string | undefined;

    constructor(data: string[]) {
        this.transportMeansIdentificationNameIdentifier = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.transportMeansIdentificationName = data[3];
        this.transportMeansNationalityCode = data[4];
    }
}

// since D11a
class PowerType {
    powerTypeCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    powerTypeDescription: string | undefined;

    constructor(data: string[]) {
        this.powerTypeCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.powerTypeDescription = data[3];
    }
}

export class DetailsOfTransport implements Segment {

    tag = "TDT";

    transportStageCodeQualifier: string;
    meansOfTransportJourneyIdentifier: string | undefined;
    modeOfTransport: ModeOfTransport | undefined;
    transportMeans: TransportMeans | undefined;
    carrier: Carrier | undefined;
    transitDirectionIndicatorCode: string | undefined;
    excessTransportationInformation: ExcessTransportationInformation | undefined;
    transportIdentification: TransportIdentification | undefined;
    transportMeansOwnershipIndicatorCode: string | undefined;

    constructor(data: ResultType) {
        this.transportStageCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.meansOfTransportJourneyIdentifier = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.modeOfTransport = new ModeOfTransport(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.transportMeans = new TransportMeans(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.carrier = new Carrier(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.transitDirectionIndicatorCode = data.elements[5][0];
        }
        if (data.elements.length > 6) {
            this.excessTransportationInformation = new ExcessTransportationInformation(data.elements[6]);
        }
        if (data.elements.length > 7) {
            this.transportIdentification = new TransportIdentification(data.elements[7]);
        }
        if (data.elements.length > 8) {
            this.transportMeansOwnershipIndicatorCode = data.elements[8][0];
        }
    }
}

export class TransportInformationD02b implements Segment {

    tag = "TDT";

    transportStageCodeQualifier: string;
    meansOfTransportJourneyIdentifier: string | undefined;
    modeOfTransport: ModeOfTransport | undefined;
    transportMeans: TransportMeansD02b | undefined;
    carrier: Carrier | undefined;
    transitDirectionIndicatorCode: string | undefined;
    excessTransportationInformation: ExcessTransportationInformation | undefined;
    transportIdentification: TransportIdentification | undefined;
    transportMeansOwnershipIndicatorCode: string | undefined;

    constructor(data: ResultType) {
        this.transportStageCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.meansOfTransportJourneyIdentifier = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.modeOfTransport = new ModeOfTransport(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.transportMeans = new TransportMeansD02b(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.carrier = new Carrier(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.transitDirectionIndicatorCode = data.elements[5][0];
        }
        if (data.elements.length > 6) {
            this.excessTransportationInformation = new ExcessTransportationInformation(data.elements[6]);
        }
        if (data.elements.length > 7) {
            this.transportIdentification = new TransportIdentification(data.elements[7]);
        }
        if (data.elements.length > 8) {
            this.transportMeansOwnershipIndicatorCode = data.elements[8][0];
        }
    }
}

export class TransportInformationD11a implements Segment {

    tag = "TDT";

    transportStageCodeQualifier: string;
    meansOfTransportJourneyIdentifier: string | undefined;
    modeOfTransport: ModeOfTransport | undefined;
    transportMeans: TransportMeansD02b | undefined;
    carrier: Carrier | undefined;
    transitDirectionIndicatorCode: string | undefined;
    excessTransportationInformation: ExcessTransportationInformation | undefined;
    transportIdentification: TransportIdentification | undefined;
    transportMeansOwnershipIndicatorCode: string | undefined;
    powerTypeDescription: PowerType | undefined;

    constructor(data: ResultType) {
        this.transportStageCodeQualifier = data.elements[0][0];
        if (data.elements.length > 1) {
            this.meansOfTransportJourneyIdentifier = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.modeOfTransport = new ModeOfTransport(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.transportMeans = new TransportMeansD02b(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.carrier = new Carrier(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.transitDirectionIndicatorCode = data.elements[5][0];
        }
        if (data.elements.length > 6) {
            this.excessTransportationInformation = new ExcessTransportationInformation(data.elements[6]);
        }
        if (data.elements.length > 7) {
            this.transportIdentification = new TransportIdentification(data.elements[7]);
        }
        if (data.elements.length > 8) {
            this.transportMeansOwnershipIndicatorCode = data.elements[8][0];
        }
        if (data.elements.length > 9) {
            this.powerTypeDescription = new PowerType(data.elements[9]);
        }
    }
}

// TMD

class MovementType {
    movementTypeDescriptionCode: string | undefined;
    movementTypeDescription: string | undefined;

    constructor(data: string[]) {
        this.movementTypeDescriptionCode = data[0];
        this.movementTypeDescription = data[1];
    }
}

export class TransportMovementDetails implements Segment {

    tag = "TMD";

    movementType: MovementType | undefined;
    equipmentPlanDescription: string | undefined;
    haulageArrangementsCode: string | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.movementType = new MovementType(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.equipmentPlanDescription = data.elements[1][0];
        }
        if (data.elements.length > 1) {
            this.haulageArrangementsCode = data.elements[2][0];
        }
    }
}

// TOD

class TermsOfDeliveryOrTransportData {
    deliveryOrTransportTermsDescriptionCode: string | undefined;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    deliveryOrTransportTermsDescription: string | undefined;
    deliveryOrTransportTermsDescription2: string | undefined;

    constructor(data: string[]) {
        this.deliveryOrTransportTermsDescriptionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.deliveryOrTransportTermsDescription = data[3];
        this.deliveryOrTransportTermsDescription2 = data[4];
    }
}

export class TermsOfDeliveryOrTransport implements Segment {

    tag = "TOD";

    deliveryOrTransportTermsFunctionCode: string | undefined;
    transportChargesPaymentMethodCode: string | undefined;
    termsOfDeliveryOrTransport: TermsOfDeliveryOrTransportData | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.deliveryOrTransportTermsFunctionCode = data.elements[0][0];
        }
        if (data.elements.length > 1) {
            this.transportChargesPaymentMethodCode = data.elements[1][0];
        }
        if (data.elements.length > 2) {
            this.termsOfDeliveryOrTransport = new TermsOfDeliveryOrTransportData(data.elements[2]);
        }
    }
}

// TSR

class ContractAndCarriageCondition {
    contractAndCarriageConditionCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.contractAndCarriageConditionCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

class Service {
    serviceRequirementCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;
    serviceRequirementCode2: string | undefined;
    codeListIdentificationCode2: string | undefined;
    codeListResponsibleAgencyCode2: string | undefined;

    constructor(data: string[]) {
        this.serviceRequirementCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
        this.serviceRequirementCode2 = data[3];
        this.codeListIdentificationCode2 = data[4];
        this.codeListResponsibleAgencyCode2 = data[5];
    }
}

class TransportPriority {
    transportServicePriorityCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.transportServicePriorityCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

class NatureOfCargo {
    cargoTypeClassificationCode: string;
    codeListIdentificationCode: string | undefined;
    codeListResponsibleAgencyCode: string | undefined;

    constructor(data: string[]) {
        this.cargoTypeClassificationCode = data[0];
        this.codeListIdentificationCode = data[1];
        this.codeListResponsibleAgencyCode = data[2];
    }
}

export class TransportServiceRequirements implements Segment {

    tag = "TSR";

    contractAndCarriageCondition: ContractAndCarriageCondition | undefined;
    service: Service | undefined;
    transportPriority: TransportPriority | undefined;
    natureOfCargo: NatureOfCargo | undefined;

    constructor(data: ResultType) {
        if (data.elements.length > 0) {
            this.contractAndCarriageCondition = new ContractAndCarriageCondition(data.elements[0]);
        }
        if (data.elements.length > 1) {
            this.service = new Service(data.elements[1]);
        }
        if (data.elements.length > 2) {
            this.transportPriority = new TransportPriority(data.elements[2]);
        }
        if (data.elements.length > 3) {
            this.natureOfCargo = new NatureOfCargo(data.elements[3]);
        }
    }
}

// UNH

class MessageIdentifier {
    messageType: string;
    messageVersionNumber: string;
    messageReleaseNumber: string;
    controllingAgencyCoded: string;
    associationAssignedCode: string | undefined;
    codeListDirectoryVersionNumber: string | undefined;
    messageTypeSubFunctionidentification: string | undefined;

    constructor(data: string[]) {
        this.messageType = data[0];
        this.messageVersionNumber = data[1];
        this.messageReleaseNumber = data[2];
        this.controllingAgencyCoded = data[3];
        this.associationAssignedCode = data[4];
        this.codeListDirectoryVersionNumber = data[5];
        this.messageTypeSubFunctionidentification = data[6];
    }
}

class StatusOfTransfer {
    sequenceOfTransfers: number;
    firstAndLastTransfer: string | undefined;

    constructor(data: string[]) {
        this.sequenceOfTransfers = parseInt(data[0]);
        this.firstAndLastTransfer = data[1];
    }
}

class MessageSubsetIdentification {
    messageSubsetIdentification: string;
    messageSubsetVersionNumber: string | undefined;
    messageSubsetReleaseNumber: string | undefined;
    controllingAgencyCoded: string | undefined;

    constructor(data: string[]) {
        this.messageSubsetIdentification = data[0];
        this.messageSubsetVersionNumber = data[1];
        this.messageSubsetReleaseNumber = data[2];
        this.controllingAgencyCoded = data[3];
    }
}

class MessageImplementationGuidelineIdentification {
    messageImplementationGuidelineIdentification: string;
    messageImplementationGuidelineVersionNumber: string | undefined;
    messageImplementationGuidelineReleaseNumber: string | undefined;
    controllingAgencyCoded: string | undefined;

    constructor(data: string[]) {
        this.messageImplementationGuidelineIdentification = data[0];
        this.messageImplementationGuidelineVersionNumber = data[1];
        this.messageImplementationGuidelineReleaseNumber = data[2];
        this.controllingAgencyCoded = data[3];
    }
}

class ScenarioIdentification {
    scenarioIdentification: string;
    scenarioVersionNumber: string | undefined;
    scenarioReleaseNumber: string | undefined;
    controllingAgencyCoded: string | undefined;

    constructor(data: string[]) {
        this.scenarioIdentification = data[0];
        this.scenarioVersionNumber = data[1];
        this.scenarioReleaseNumber = data[2];
        this.controllingAgencyCoded = data[3];
    }
}

export class MessageHeader implements Segment {

    tag = "UNH";

    messageReferenceNumber: string;
    messageIdentifier: MessageIdentifier;
    commonAccessReference: string | undefined;
    statusOfTransfer: StatusOfTransfer | undefined;
    messageSubsetIdentification: MessageSubsetIdentification | undefined;
    messageImplementationGuidelineIdentification: MessageImplementationGuidelineIdentification | undefined;
    scenarioIdentification: ScenarioIdentification | undefined;

    constructor(data: ResultType) {
        this.messageReferenceNumber = data.elements[0][0];
        this.messageIdentifier = new MessageIdentifier(data.elements[1]);
        if (data.elements.length > 2) {
            this.commonAccessReference = data.elements[2][0];
        }
        if (data.elements.length > 3) {
            this.statusOfTransfer = new StatusOfTransfer(data.elements[3]);
        }
        if (data.elements.length > 4) {
            this.messageSubsetIdentification = new MessageSubsetIdentification(data.elements[4]);
        }
        if (data.elements.length > 5) {
            this.messageImplementationGuidelineIdentification = new MessageImplementationGuidelineIdentification(data.elements[5]);
        }
        if (data.elements.length > 6) {
            this.scenarioIdentification = new ScenarioIdentification(data.elements[6]);
        }
    }
}

// UNS

export class SectionControl implements Segment {

    tag = "UNS";

    sectionIdentification: string;

    constructor(data: ResultType) {
        this.sectionIdentification = data.elements[0][0];
    }
}

// UNT

export class MessageTrailer implements Segment {

    tag = "UNT";

    numberOfSegmentsInAMessage: number;
    messageReferenceNumber: string;

    constructor(data: ResultType) {
        this.numberOfSegmentsInAMessage = parseInt(data.elements[0][0]);
        this.messageReferenceNumber = data.elements[1][0];
    }
}
