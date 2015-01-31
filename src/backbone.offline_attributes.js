(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["backbone", "underscore"], factory);
  } else if (typeof exports !== "undefined") {
    return module.exports = factory(require("backbone"), require("underscore"));
  } else {
    factory(root.Backbone, root._);
  }
})(this, function(Backbone, _) {
  var OriginalBackboneModel = Backbone.Model;

  Backbone.Model = OriginalBackboneModel.extend({
    constructor: function(attributes, options) {
      OriginalBackboneModel.call(this, attributes, options);

      // fetch the previous stored offiline attributes
      var currentOfflineAttributes = this.currentStoredOfflineAttributes(),
          attributesWithPreviousOfflineAttributes = _.extend({}, this.attributes, currentOfflineAttributes);

      this.set(attributesWithPreviousOfflineAttributes);

      this.on("sync", this.storeOfflineAttributes);
    },

    offlineAttributeStorageIdentifier: function() {
      return this.get("id");
    },

    set: function(key, val, options) {
      var originalReturn = OriginalBackboneModel.prototype.set.apply(this, arguments);

      this.storeOfflineAttributes();

      return originalReturn;
    },

    currentStoredOfflineAttributes: function() {
      var identifier = this.offlineAttributeStorageIdentifier();

      return (JSON.parse(window.localStorage.getItem(identifier)) || {});
    },

    storeOfflineAttributes: function() {
      if (!this.offlineAttributeStorageIdentifier()) {
        return false;
      }

      var offlineAttributes = _.pick(this.attributes, this.offlineAttributes),
          currentOfflineAttributes = this.currentStoredOfflineAttributes();

      // only updates the localStorage if the new offline attributes are different
      // from the previous stored
      if (!_.isEqual(offlineAttributes, currentOfflineAttributes)) {
        _.extend(currentOfflineAttributes, offlineAttributes);

        window.localStorage.setItem(this.offlineAttributeStorageIdentifier(),
                                    JSON.stringify(currentOfflineAttributes));
      }

      return offlineAttributes;
    }
  });
});
