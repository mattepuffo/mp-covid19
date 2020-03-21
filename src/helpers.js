import {globalConfig} from "./config";
import axios from "axios";

function getYesterdaysDate() {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    let month = d.getMonth() + 1;
    return d.getFullYear() + '-' + (month < 10 ? '0' + month : '' + month) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate());
}

function formatDate(date) {
    let d = new Date(date);
    let month = d.getMonth() + 1;
    return (d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()) + '/' + (month < 10 ? '0' + month : '' + month) + '/' + d.getFullYear();
}

export async function getDataRegion() {
    const {dataRegionUrl} = globalConfig();
    return axios.get(dataRegionUrl)
        .then(res => {
            const today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
            const yesterday = getYesterdaysDate();
            const obj = res.data;
            let objArr = obj.filter(obj => obj.data.includes(today));
            sessionStorage.setItem("GIORNO", formatDate(today));
            if (objArr.length === 0) {
                objArr = obj.filter(obj => obj.data.includes(yesterday));
                sessionStorage.setItem("GIORNO", formatDate(yesterday));
            }

            return objArr;
        }).catch(error => console.log(error));
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
