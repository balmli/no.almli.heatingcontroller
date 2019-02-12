declare module "date-easter" {
    /**
     * The easter date for a particular year.
     */
    export class EasterDate {
        /**
         * The year which was queried.
         */
        readonly year: number;

        /**
         * The month. 1-12 - NOT ZERO BASED!
         */
        readonly month: number;

        /**
         * The day. 1-31
         */
        readonly day: number;
    }

    /**
     * Computes the gregorian easter date for the given year.
     * This is an alias / convenience method for gregorianEaster(year).
     * 
     * @param year the year for which the easter day should be computed 
     */
    export function easter(year: number): EasterDate;
    export function gregorianEaster(year: number): EasterDate;
    export function julianEaster(year: number): EasterDate;
    export function orthodoxEaster(year: number): EasterDate;
}
