import React, {Component} from 'react';
import {connect} from 'react-redux';
import './SignUpContainer.scss';
import '../../index.scss';
import logo from '../../assets/images/logo.svg';
import {Link, Switch, Route} from 'react-router-dom';
import {GetCountries, SetPhone} from '../../store/actions/SignUpActions';
import CountryCodesList from './Components/CountryCodesList/CountryCodesList';
import Keyboard from '../../Components/Keyboard/Keyboard';
import GeoServerService from "../../modules/services/GeoServerService";
import ChannelsList from "../../Components/ChannelsList/ChannelsList";


const GeoService = new GeoServerService();

class SignUpContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            codeListVisible: false,
            selectedCode: null,
            invalidPhoneErrorMessage: false
        };
        this.showFullCodeList = this.showFullCodeList.bind(this);
    }

    componentWillMount = () => {
        // this.props.GetInfo();
        this.props.GetCountries();
    };

    scrollIntoView = (id) => {
        const element = document.getElementById(id);
        element.scrollIntoView();
    };

    showFullCodeList = (id) => {
        if (this.state.codeListVisible) {
            this.setState({
                codeListVisible: !this.state.codeListVisible,
                selectedCode: id
            });
        } else {
            this.setState({
                ...this.state,
                codeListVisible: !this.state.codeListVisible
            });
        }
        this.scrollIntoView(id)
    };

    inputText = (key) => {
        const content = document.getElementById('input-field').textContent;
        if (key === 'backspace') {
            if (isNaN(parseFloat(content))) {
                document.getElementById('input-field').textContent = '';
            } else {
                document.getElementById('input-field').textContent = content.substring(0, content.length - 1);
            }
        } else {
            if (isNaN(parseFloat(content))) {
                document.getElementById('input-field').textContent = '';
            }
            if (document.getElementById('input-field').textContent.length < 9) {
                document.getElementById('input-field').textContent += key;
            }
        }
    };

    setPhone = () => {
        const inputContent = document.getElementById('input-field').textContent,
            code = document.getElementById(this.props.countryId).textContent;
        if (!isNaN(parseFloat(inputContent))) {
            const phoneNumber = parseFloat(code) + inputContent;
            this.props.SetPhone(phoneNumber);
        } else {
            this.setState({
                ...this.state,
                invalidPhoneErrorMessage: 'Номер телефона введен неверно'
            });
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    invalidPhoneErrorMessage: false
                });
            }, 3000)
        }
    };


    render() {
        let selected = false;
        const {countryId, countries, setPhoneErrorMessage} = this.props,
            {codeListVisible, selectedCodeId, invalidPhoneErrorMessage} = this.state,
            countryCodes = countries.map(country => {
                if ((countryId === country.id && selectedCodeId === null) ||
                    (selectedCodeId === country.id && !codeListVisible)) {
                    selected = true;
                } else {
                    selected = false;
                }
                return (
                    <CountryCodesList id={country.id}
                                      scrollIntoView={this.scrollIntoView}
                                      focusPath={'code-item-' + country.id}
                                      selected={selected}
                                      codeListVisible={codeListVisible}
                                      showFullCodeList={this.showFullCodeList}
                                      key={country.id}>
                        {country.telephone_code}
                    </CountryCodesList>
                )
            });
        return (
            <div className="signup-container">
                <img className="logo" src={logo} alt="Sweet TV"/>
                <h1>Введите свой номер телефона для подключения</h1>
                {invalidPhoneErrorMessage ? <p>{invalidPhoneErrorMessage}</p> : null}
                {setPhoneErrorMessage ? <p>{setPhoneErrorMessage}</p> : null}
                <div nv-scope="phone-signup-field" className="wrap">
                    <ul className="country-codes-list">CountryCodes</ul>
                    <Keyboard inputText={this.inputText}/>
                    <div id='input-field' className="input-field">(___)___-__-__</div>
                    <button nv-el className="button button-signup"
                            onClick={this.props.SetPhone}>Активировать
                    </button>
                </div>
                <Link to="/main/">Click</Link>
                <Switch>
                    <Route path="/main/" exact component={ChannelsList}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        countries: state.signUp.countries,
        countryId: state.signUp.countryId,
        partnerId: state.signUp.partnerId,
        setPhoneErrorMessage: state.signUp.setPhoneErrorMessage
    };
};

const mapDispatchToProps = dispatch => {
    return {
        GetCountries: () => dispatch(GetCountries()),
        // GetInfo: () => dispatch(GeoService.GetInfo()),
        SetPhone: () => dispatch(SetPhone()),
        HideErrorMessage: () => dispatch({type: 'HIDE_ERROR_MESSAGE'})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer);
