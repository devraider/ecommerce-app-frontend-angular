export class OrderHistory {

    constructor (
        public id: number,
        public orderTrackingNumber: string,
        public totalPrice: string,
        public totalQuantity: number,
        public dateCreated: Date
    ) {}
}
