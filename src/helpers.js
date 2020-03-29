import {globalConfig} from "./config";
import axios from "axios";

export function getYesterdaysDate(num) {
    let d = new Date();
    d.setDate(d.getDate() - num);
    let month = d.getMonth() + 1;
    return d.getFullYear() + '-' + (month < 10 ? '0' + month : '' + month) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate());
}

export function formatDate(date) {
    let d = new Date(date);
    let month = d.getMonth() + 1;
    return (d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()) + '/' + (month < 10 ? '0' + month : '' + month) + '/' + d.getFullYear();
}

export function getTime() {
    var today = new Date();
    return (today.getHours() < 10 ? '0' + today.getHours() : +'' + today.getHours()) + ":" + today.getMinutes();
}

export async function getDataRegion(giorno) {
    const {dataRegionUrl} = globalConfig();

    return axios.get(dataRegionUrl)
        .then(res => {
            const obj = res.data;
            return obj.filter(obj => obj.data.includes(giorno));
        });
}

export async function getTotal(objArr) {
    let dimessi = 0;
    let deceduti = 0;
    let positivi = 0;
    let result = [];

    let sumDimessi = objArr.reduce(function (total, currentValue) {
        return total + currentValue.dimessi_guariti;
    }, dimessi);
    let sumDeceduti = objArr.reduce(function (total, currentValue) {
        return total + currentValue.deceduti;
    }, deceduti);
    let sumPositivi = objArr.reduce(function (total, currentValue) {
        return total + currentValue.totale_casi;
    }, positivi);

    result.push(sumDimessi, sumDeceduti, sumPositivi);
    return result;
}

export async function getDatiInternazionali() {
    return fetch("https://sharad-gql-covid19.herokuapp.com/graphql",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                query: `{
                    countries(sortBy: "deaths", order: "desc") {
                        country
                        cases
                        todayCases
                        deaths
                        todayDeaths
                        recovered
                        active
                        critical
                        casesPerOneMillion
                        deathsPerOneMillion
                    } 
                }`
            })
        }
    )
        .then(res => res.json())
        .then(res => {
            return res.data.countries;
        });
}
