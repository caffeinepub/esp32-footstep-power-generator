import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    addEnergy(energy: number): Promise<void>;
    addFootsteps(footsteps: bigint): Promise<void>;
    addRuntime(runtime: bigint): Promise<void>;
    getTotalEnergy(): Promise<number>;
    getTotalFootsteps(): Promise<bigint>;
    getTotalRuntime(): Promise<bigint>;
}
