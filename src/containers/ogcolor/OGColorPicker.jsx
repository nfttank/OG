import React from 'react';
import './ogcolorpicker.css';
import { OgImg } from '../../components';
import { PopoverPicker } from '..';

class OGColorPicker extends React.Component {

    constructor(props) {
        super(props.data.props);
    
        this.state = {
            color: '#fdae01'
        };
      }

      render() {

        return (
            <div className="og_ogcolorpicker-group">
                <OgImg data={{id: this.props.data.ogId, svg: this.props.data.ogSvg, useLink: false}} /> 
                {
                    this.props.data.connected && !this.props.data.soldOut && 
                    <div className="og_ogcolorpicker-controls">
                        <PopoverPicker color={this.state.color} onChange={(c) => this.setState({color: c})} />
                        <button type="button" onClick={() => this.props.data.mint(this.props.data.application, this.state.color)}>Mint {this.props.data.application}</button>
                    </div>
                }
            </div>
        )
      }
    }

export default OGColorPicker;
