'use strict'

/**
 * Copyright 2016 Signal K and Fabian Tollenaar <fabian@signalk.org>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const Parser = require('../lib')
const chai = require('chai')
const should = chai.Should()

chai.use(require('chai-things'))

describe('GGA', () => {

  it('Converts OK using individual parser', done => {
    const parser = new Parser

    parser.on('signalk:delta', delta => {
      // Paths
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.longitude')
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.latitude')
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.gnss.methodQuality')
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.gnss.satellites')
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.gnss.antennaAltitude')
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.gnss.horizontalDilution')
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.gnss.differentialAge')
      delta.updates[0].values.should.contain.an.item.with.property('path', 'navigation.position.gnss.differentialReference')
      // Values
      delta.updates[0].values[0].value.should.equal(-122.03782631066667)
      delta.updates[0].values[1].value.should.equal(37.39109795066667)
      delta.updates[0].values[2].value.should.equal('DGNSS fix')
      delta.updates[0].values[3].value.should.equal(6)
      delta.updates[0].values[4].value.should.equal(18)
      delta.updates[0].values[5].value.should.equal(1)
      delta.updates[0].values[6].value.should.equal(2)
      delta.updates[0].values[7].value.should.equal('0031')
      done()
    })

    parser.parse('$GPGGA,172814.0,3723.46587704,N,12202.26957864,W,2,6,1.2,18.893,M,-25.669,M,2.0,0031*4F').catch(e => done(e))
  })

  it('Doesn\'t choke on empty sentences', done => {
    new Parser()
    .parse('$GPGGA,,,,,,,,,,,,,,*56')
    .then(result => {
      should.equal(result, null)
      done()
    })
    .catch(e => done(e))
  })

})
