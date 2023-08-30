/*
Store
add callbacks : (delta:number)=>void
update : each tick
*/
export class Store<T extends Function> extends Set {
	store = (fn: T) => {
		this.add(fn);
		return () => {
			this.delete(fn);
		};
	};
	reset = () => {
		this.clear();
	};
	update = (data: unknown) => {
		this.forEach((fn) => fn(data));
	};
}
