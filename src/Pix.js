"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pix = void 0;
var PixCommonsKeyID;
(function (PixCommonsKeyID) {
    PixCommonsKeyID["PAYLOAD_FORMAT_INDICATOR"] = "00";
    PixCommonsKeyID["MERCHANT_ACCOUNT_INFORMATION"] = "26";
    PixCommonsKeyID["MERCHANT_ACCOUNT_INFORMATION_GUI"] = "00";
    PixCommonsKeyID["MERCHANT_ACCOUNT_INFORMATION_KEY"] = "01";
    PixCommonsKeyID["MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION"] = "02";
    PixCommonsKeyID["MERCHANT_CATEGORY_CODE"] = "52";
    PixCommonsKeyID["TRANSACTION_CURRENCY"] = "53";
    PixCommonsKeyID["TRANSACTION_AMOUNT"] = "54";
    PixCommonsKeyID["COUNTRY_CODE"] = "58";
    PixCommonsKeyID["MERCHANT_NAME"] = "59";
    PixCommonsKeyID["MERCHANT_CITY"] = "60";
    PixCommonsKeyID["ADDITIONAL_DATA_FIELD_TEMPLATE"] = "62";
    PixCommonsKeyID["ADDITIONAL_DATA_FIELD_TEMPLATE_TXID"] = "05";
    PixCommonsKeyID["CRC16"] = "63";
})(PixCommonsKeyID || (PixCommonsKeyID = {}));
class Pix {
    constructor(props) {
        this.props = props;
        this.getCRCChecksum = (data) => {
            const payload = data.concat(PixCommonsKeyID.CRC16).concat("04");
            let polynomial = 0x1021;
            let result = 0xffff;
            for (const offset of payload) {
                result ^= offset.charCodeAt(0) << 8;
                for (let bitwise = 0; bitwise < 8; bitwise++) {
                    if ((result <<= 1) & 0x10000) {
                        result ^= polynomial;
                    }
                    result &= 0xffff;
                }
            }
            return PixCommonsKeyID.CRC16 + "04" + result.toString(16).toUpperCase();
        };
        this.getMerchantAccountInformation = () => {
            const gui = this.getValue({
                id: PixCommonsKeyID.MERCHANT_ACCOUNT_INFORMATION_GUI,
                value: "BR.GOV.BCB.PIX",
            });
            const key = this.getValue({
                id: PixCommonsKeyID.MERCHANT_ACCOUNT_INFORMATION_KEY,
                value: this.props.key,
            });
            const description = this.getValue({
                id: PixCommonsKeyID.MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION,
                value: this.props.description,
            });
            return this.getValue({
                id: PixCommonsKeyID.MERCHANT_ACCOUNT_INFORMATION,
                value: `${gui}${key}${description}`,
            });
        };
        this.getAdditionalDataFieldTemplate = () => {
            const txId = this.getValue({
                id: PixCommonsKeyID.ADDITIONAL_DATA_FIELD_TEMPLATE_TXID,
                value: this.props.transactionId,
            });
            return this.getValue({
                id: PixCommonsKeyID.ADDITIONAL_DATA_FIELD_TEMPLATE,
                value: txId,
            });
        };
        this.getValue = ({ id, value }) => {
            const size = value.length.toString().padStart(2, "0");
            return `${id}${size}${value}`;
        };
        this.build = () => {
            const payload = this.getValue({
                id: PixCommonsKeyID.PAYLOAD_FORMAT_INDICATOR,
                value: "01",
            })
                .concat(this.getMerchantAccountInformation())
                .concat(this.getValue({
                id: PixCommonsKeyID.MERCHANT_CATEGORY_CODE,
                value: "0000",
            }))
                .concat(this.getValue({
                id: PixCommonsKeyID.TRANSACTION_CURRENCY,
                value: "986",
            }))
                .concat(this.getValue({
                id: PixCommonsKeyID.TRANSACTION_AMOUNT,
                value: this.props.value.toString(),
            }))
                .concat(this.getValue({
                id: PixCommonsKeyID.COUNTRY_CODE,
                value: "BR",
            }))
                .concat(this.getValue({
                id: PixCommonsKeyID.MERCHANT_NAME,
                value: this.props.name,
            }))
                .concat(this.getValue({
                id: PixCommonsKeyID.MERCHANT_CITY,
                value: this.props.city,
            }))
                .concat(this.getAdditionalDataFieldTemplate());
            return payload.concat(this.getCRCChecksum(payload));
        };
        this.props.transactionId = `PAG${Date.now().toString(36).toUpperCase()}`;
        this.props.description = "Vaquejada - Fazenda Pajeu";
    }
}
exports.Pix = Pix;
