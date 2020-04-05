// https://github.com/pcm-dpc/COVID-19
// https://github.com/hidran/coronavirus-italia/tree/master/src
// https://github.com/sharadcodes/covid19-graphql

import * as React from "react";
import {Layout, Button, Input, Row, Col, Table, Card, Statistic, PageHeader, Typography, Divider} from 'antd';
import {formatDate, getDataRegion, getTime, getTotal, getYesterdaysDate, getDatiInternazionali} from "./helpers";
import 'antd/dist/antd.css';

const {Content, Footer} = Layout;
const {Paragraph} = Typography;

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            itemsPaesi: [],
            itemsIeri: [],
            searchText: '',
            searchedColumn: '',
            visible: false,
            totDimessi: 0,
            totDeceduti: 0,
            totCasi: 0,
            totDimessiIeri: 0,
            totDecedutiIeri: 0,
            totCasiIeri: 0
        }
    }

    async componentDidMount() {
        let today = null;
        let yesterday = null;

        if (getTime() < "18:00") {
            today = getYesterdaysDate(1);
            yesterday = getYesterdaysDate(2);
        } else {
            today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
            yesterday = getYesterdaysDate(1);
        }

        sessionStorage.setItem("GIORNO", formatDate(today));

        await getDataRegion(today)
            .then(data => {
                this.setState({
                    items: data
                })
            });

        await getDataRegion(yesterday)
            .then(data => {
                this.setState({
                    itemsIeri: data
                })
            });

        await getTotal(this.state.items)
            .then(tot => {
                this.setState({
                    totDimessi: tot[0],
                    totDeceduti: tot[1],
                    totCasi: tot[2]
                });
            });

        await getTotal(this.state.itemsIeri)
            .then(tot => {
                this.setState({
                    totDimessiIeri: tot[0],
                    totDecedutiIeri: tot[1],
                    totCasiIeri: tot[2]
                });
            });

        await getDatiInternazionali()
            .then(data => {
                this.setState({
                    itemsPaesi: data
                })
            });
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        }
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };

    render() {
        const columns = [
            {
                title: 'Regione',
                dataIndex: 'denominazione_regione',
                key: 'denominazione_regione',
                sorter: (a, b) => {
                    if (a.denominazione_regione < b.denominazione_regione) {
                        return -1;
                    }
                    if (a.denominazione_regione > b.denominazione_regione) {
                        return 1;
                    }
                },
                sortDirections: ['descend'],
                ...this.getColumnSearchProps('denominazione_regione')
            },
            {
                title: 'Ricoverati',
                dataIndex: 'ricoverati_con_sintomi',
                key: 'ricoverati_con_sintomi',
                sorter: (a, b) => {
                    if (a.ricoverati_con_sintomi < b.ricoverati_con_sintomi) {
                        return -1;
                    }
                    if (a.ricoverati_con_sintomi > b.ricoverati_con_sintomi) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Terapia intensiva',
                dataIndex: 'terapia_intensiva',
                key: 'terapia_intensiva',
                sorter: (a, b) => {
                    if (a.terapia_intensiva < b.terapia_intensiva) {
                        return -1;
                    }
                    if (a.terapia_intensiva > b.terapia_intensiva) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Totale ospedalizzati',
                dataIndex: 'totale_ospedalizzati',
                key: 'totale_ospedalizzati',
                sorter: (a, b) => {
                    if (a.totale_ospedalizzati < b.totale_ospedalizzati) {
                        return -1;
                    }
                    if (a.totale_ospedalizzati > b.totale_ospedalizzati) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Isolamento',
                dataIndex: 'isolamento_domiciliare',
                key: 'isolamento_domiciliare',
                sorter: (a, b) => {
                    if (a.isolamento_domiciliare < b.isolamento_domiciliare) {
                        return -1;
                    }
                    if (a.isolamento_domiciliare > b.isolamento_domiciliare) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Totale positivi',
                dataIndex: 'totale_positivi',
                key: 'totale_positivi',
                sorter: (a, b) => {
                    if (a.totale_positivi < b.totale_positivi) {
                        return -1;
                    }
                    if (a.totale_positivi > b.totale_positivi) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Variazione totale positivi',
                dataIndex: 'variazione_totale_positivi',
                key: 'variazione_totale_positivi',
                sorter: (a, b) => {
                    if (a.variazione_totale_positivi < b.variazione_totale_positivi) {
                        return -1;
                    }
                    if (a.variazione_totale_positivi > b.variazione_totale_positivi) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Dimessi',
                dataIndex: 'dimessi_guariti',
                key: 'dimessi_guariti',
                sorter: (a, b) => {
                    if (a.dimessi_guariti < b.dimessi_guariti) {
                        return -1;
                    }
                    if (a.dimessi_guariti > b.dimessi_guariti) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Deceduti',
                dataIndex: 'deceduti',
                key: 'deceduti',
                sorter: (a, b) => {
                    if (a.deceduti < b.deceduti) {
                        return -1;
                    }
                    if (a.deceduti > b.deceduti) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Totale casi',
                dataIndex: 'totale_casi',
                key: 'totale_casi',
                sorter: (a, b) => {
                    if (a.totale_casi < b.totale_casi) {
                        return -1;
                    }
                    if (a.totale_casi > b.totale_casi) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Nuovi positivi',
                dataIndex: 'nuovi_positivi',
                key: 'nuovi_positivi',
                sorter: (a, b) => {
                    if (a.nuovi_positivi < b.nuovi_positivi) {
                        return -1;
                    }
                    if (a.nuovi_positivi > b.nuovi_positivi) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Tamponi',
                dataIndex: 'tamponi',
                key: 'tamponi',
                sorter: (a, b) => {
                    if (a.tamponi < b.tamponi) {
                        return -1;
                    }
                    if (a.tamponi > b.tamponi) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            }
        ];

        const columnsPaesi = [
            {
                title: 'Paese',
                dataIndex: 'country',
                key: 'country',
                sorter: (a, b) => {
                    if (a.country < b.country) {
                        return -1;
                    }
                    if (a.country > b.country) {
                        return 1;
                    }
                },
                sortDirections: ['descend'],
                ...this.getColumnSearchProps('country')
            },
            {
                title: 'Attivi',
                dataIndex: 'active',
                key: 'active',
                sorter: (a, b) => {
                    if (a.active < b.active) {
                        return -1;
                    }
                    if (a.active > b.active) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Casi',
                dataIndex: 'cases',
                key: 'cases',
                sorter: (a, b) => {
                    if (a.cases < b.cases) {
                        return -1;
                    }
                    if (a.cases > b.cases) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Casi per un milione',
                dataIndex: 'casesPerOneMillion',
                key: 'casesPerOneMillion',
                sorter: (a, b) => {
                    if (a.casesPerOneMillion < b.casesPerOneMillion) {
                        return -1;
                    }
                    if (a.casesPerOneMillion > b.casesPerOneMillion) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Critici',
                dataIndex: 'critical',
                key: 'critical',
                sorter: (a, b) => {
                    if (a.critical < b.critical) {
                        return -1;
                    }
                    if (a.critical > b.critical) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Morti',
                dataIndex: 'deaths',
                key: 'deaths',
                sorter: (a, b) => {
                    if (a.deaths < b.deaths) {
                        return -1;
                    }
                    if (a.deaths > b.deaths) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Morti per un milione',
                dataIndex: 'deathsPerOneMillion',
                key: 'deathsPerOneMillion',
                sorter: (a, b) => {
                    if (a.deathsPerOneMillion < b.deathsPerOneMillion) {
                        return -1;
                    }
                    if (a.deathsPerOneMillion > b.deathsPerOneMillion) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Ricoverati',
                dataIndex: 'recovered',
                key: 'recovered',
                sorter: (a, b) => {
                    if (a.recovered < b.recovered) {
                        return -1;
                    }
                    if (a.recovered > b.recovered) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Casi oggi',
                dataIndex: 'todayCases',
                key: 'todayCases',
                sorter: (a, b) => {
                    if (a.todayCases < b.todayCases) {
                        return -1;
                    }
                    if (a.todayCases > b.todayCases) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            },
            {
                title: 'Morti oggi',
                dataIndex: 'todayDeaths',
                key: 'todayDeaths',
                sorter: (a, b) => {
                    if (a.todayDeaths < b.todayDeaths) {
                        return -1;
                    }
                    if (a.todayDeaths > b.todayDeaths) {
                        return 1;
                    }
                },
                sortDirections: ['descend']
            }
        ];

        return (
            <div>
                <Layout className="layout">
                    <Content>
                        <PageHeader
                            className="site-page-header"
                            title="DATI COVID-19"
                            subTitle={"Aggiornati al " + sessionStorage.getItem("GIORNO")}
                        />
                        <div className="site-statistic-demo-card">
                            <Row>
                                <Col flex={8}>
                                    <Card>
                                        <Statistic
                                            title="Totale deceduti"
                                            value={this.state.totDeceduti}
                                            valueStyle={{color: '#cf1322'}}
                                        />
                                        <Paragraph>
                                            +{this.state.totDeceduti - this.state.totDecedutiIeri} da ieri
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col flex={8}>
                                    <Card>
                                        <Statistic
                                            title="Totale dimessi"
                                            value={this.state.totDimessi}
                                            valueStyle={{color: '#52c41a'}}
                                        />
                                        <Paragraph>
                                            +{this.state.totDimessi - this.state.totDimessiIeri} da ieri
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col flex={8}>
                                    <Card>
                                        <Statistic
                                            title="Totale casi"
                                            value={this.state.totCasi}
                                            valueStyle={{color: '#1890ff'}}
                                        />
                                        <Paragraph>
                                            +{this.state.totCasi - this.state.totCasiIeri} da ieri
                                        </Paragraph>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div className="site-layout-content">
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={24}>
                                    <Table
                                        dataSource={this.state.items}
                                        pagination={{
                                            total: this.state.items.length,
                                            pageSize: this.state.items.length,
                                            hideOnSinglePage: true
                                        }}
                                        layout="fixed"
                                        columns={columns}
                                        bordered
                                        title={() => 'DATI PER REGIONE'}
                                        size="middle"
                                        rowKey="codice_regione"
                                        scroll={{ y: 300 }}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <Divider/>
                        <div className="site-layout-content">
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={24}>
                                    <Table
                                        dataSource={this.state.itemsPaesi}
                                        pagination={{
                                            total: this.state.itemsPaesi.length,
                                            pageSize: this.state.itemsPaesi.length,
                                            hideOnSinglePage: true
                                        }}
                                        layout="fixed"
                                        columns={columnsPaesi}
                                        bordered
                                        title={() => 'DATI PER PAESE'}
                                        size="middle"
                                        rowKey="country"
                                        scroll={{ y: 500 }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Content>
                    <Footer>
                        Mattepuffo.com © 2020
                        {'\u00A0'}|{'\u00A0'}
                        Licenza:{'\u00A0'}
                        <a href="https://creativecommons.org/licenses/by/4.0/deed.en" target="_blank"
                           rel="noopener noreferrer">
                            CC-BY-4.0
                        </a>
                        {'\u00A0'}|{'\u00A0'}
                        Editore / Autore dataset:{'\u00A0'}
                        <a href="http://www.protezionecivile.gov.it/home" target="_blank" rel="noopener noreferrer">
                            Dipartimento della Protezione Civile
                        </a>
                        {'\u00A0'}|{'\u00A0'}
                        Altri links:{'\u00A0'}
                        <a href="https://covidlive.it/" target="_blank" rel="noopener noreferrer">
                            Covidlive
                        </a>
                        {'\u00A0'}-{'\u00A0'}
                        <a href="https://www.bing.com/covid" target="_blank" rel="noopener noreferrer">
                            Microsoft covid
                        </a>
                    </Footer>
                </Layout>
            </div>
        );
    }

}
