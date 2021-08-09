
export interface OrderTable {
	getManyDto(filter?: import('rdb-client').RawFilter, strategy?: OrderStrategy): Promise<OrderArray>;
	getManyDto(orders: Array<Order>, strategy?: OrderStrategy): Promise<OrderArray>;
	getMany(filter?: import('rdb-client').RawFilter, strategy?: OrderStrategy): Promise<OrderArray>;
	getMany(orders: Array<Order>, strategy?: OrderStrategy): Promise<OrderArray>;
	tryGetFirst(filter?: import('rdb-client').RawFilter, strategy?: OrderStrategy): Promise<OrderRow>;
	tryGetFirst(orders: Array<Order>, strategy?: OrderStrategy): Promise<OrderRow>;
	getById(gid: string, strategy?: OrderStrategy): Promise<OrderRow>;
	tryGetById(gid: string, strategy?: OrderStrategy): Promise<OrderRow>;
	proxify(orders: Order[]): OrderArray;
	id : import('rdb-client').UUIDColumn;
	orderNo : import('rdb-client').StringColumn;
	customFilters: OrderCustomFilters;
}

export interface OrderCustomFilters {
}

export interface OrderArray extends Array<Order> {
	save(options?: SaveOrderOptions): Promise<void>;
	acceptChanges(): void;
	clearChanges(): void;
	refresh(strategy?: OrderStrategy | undefined | null): Promise<void>;
	insert(): Promise<void>;
	delete(): Promise<void>;
}

export interface SaveOrderOptions {
	defaultConcurrency?: import('rdb-client').Concurrencies
	concurrency?: OrderConcurrency;
}

export interface OrderConcurrency {
	orderNo? : import('rdb-client').Concurrencies;
	lines?: LinesConcurrency;
}

export interface Order {
	id? : string;
	orderNo? : string;
	lines?: Lines[];
}

export interface OrderStrategy {
	orderNo? : any;
	lines?: LinesStrategy  | null;
	limit?: number;
	orderBy?: Array<"id" | "id desc"| "orderNo" | "orderNo desc"> | "id" | "id desc"| "orderNo" | "orderNo desc";
}

export interface LinesConcurrency {
	orderId? : import('rdb-client').Concurrencies;
	product? : import('rdb-client').Concurrencies;
	order?: OrderConcurrency;
}

export interface Lines {
	id? : string;
	orderId? : string;
	product? : string;
	order?: Order | null;
}

export interface LinesStrategy {
	orderId? : any;
	product? : any;
	order?: OrderStrategy | null;
	limit?: number;
	orderBy?: Array<"id" | "id desc"| "orderId" | "orderId desc"| "product" | "product desc"> | "id" | "id desc"| "orderId" | "orderId desc"| "product" | "product desc";
}

export interface OrderConcurrency {
	orderNo? : import('rdb-client').Concurrencies;
	lines?: LinesConcurrency;
}

export interface Order {
	id? : string;
	orderNo? : string;
	lines?: Lines[];
}

export interface OrderStrategy {
	orderNo? : any;
	lines?: LinesStrategy  | null;
	limit?: number;
	orderBy?: Array<"id" | "id desc"| "orderNo" | "orderNo desc"> | "id" | "id desc"| "orderNo" | "orderNo desc";
}

export interface OrderRow extends Order {
	save(): Promise<void>;
	refresh(strategy?: OrderStrategy | undefined | null): Promise<void>;
	acceptChanges(): void;
	clearChanges(): void;
	insert(): Promise<void>
	delete(): Promise<void>;
}
