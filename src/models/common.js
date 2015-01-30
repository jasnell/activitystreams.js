/**
 * Copyright 2013 International Business Machines Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Utility library for working with Activity Streams Actions
 * Requires underscorejs.
 *
 * @author James M Snell (jasnell@us.ibm.com)
 */
var Population = require('./population');
var util = require('util');
var utils = require('../utils');
var vocabs = require('../vocabs');

function Common(store, reasoner, id, subject) {
  if (!(this instanceof Common))
    return new Common(store, reasoner, id, subject);
  Population.call(this, store, reasoner, id, subject);
}
util.inherits(Common, Population);
utils.define(Common.prototype, 'havingDimension', function() {
  return this.get(vocabs.social.havingDimension);
});
utils.define(Common.prototype, 'confidence', function() {
  var ret = Math.min(100,Math.max(0,this.get(vocabs.social.confidence)));
  return isNaN(ret) ? undefined : ret;
});

Common.Builder = function(reasoner,types,base) {
  if (!(this instanceof Common.Builder))
    return new Common.Builder(reasoner,types,base);
  Population.Builder.call(
    this, 
    reasoner, 
    utils.merge_types(reasoner,vocabs.social.Common, types),
    base || new Common(undefined,reasoner));
};
util.inherits(Common.Builder,Population.Builder);

Common.Builder.prototype.havingDimension = function(val) {
  this.set(vocabs.social.havingDimension, val);
  return this;
};

Common.Builder.prototype.confidence = function(val) {
  if (!utils.is_integer(val))
    throw new Error('confidence must be an integer between 0 and 100');
  val = Math.max(0, Math.min(100, val));
  this.set(vocabs.social.confidence, val);
  return this;
};

module.exports = Common;
