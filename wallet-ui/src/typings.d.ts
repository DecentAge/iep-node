/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
    id: string;
}
declare module 'leaflet';
declare module 'perfect-scrollbar';
declare module 'd3-shape';

declare module "*.json" {
    const value: any;
    export default value;
}