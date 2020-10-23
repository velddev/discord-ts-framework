import { Module } from "../types/module";

export function event(name: string) {
    return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata("__event", name, target, propertyKey);
    }; 
}

export function command(name: string) {
    return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata("__command", name, target, propertyKey);
    }; 
}