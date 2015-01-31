describe("Backbone.OfflineAttributes", function () {
  beforeEach(function () {
    Event = Backbone.Model.extend({
      offlineAttributes: ["starred"],

      offlineAttributeStorageIdentifier: function() {
        return this.isNew() ? false : "event_meta_" + this.get("id");
      }
    });
  });

  afterEach(function() {
    window.localStorage.clear();
    delete Event;
  });

  context("with previous persisted offline attributes", function() {
    it("instantiating a model should brings these infos as regular attributes", function() {
      window.localStorage.setItem("event_meta_1", JSON.stringify({ starred: true }));

      var myEvent = new Event({ id: 1, title: "My event" });

      expect(myEvent.toJSON()).to.be.eql({ id: 1, title: "My event", starred: true });
    });
  });

  it("defining a offline attribute value should update the local storage", function() {
    new Event({ id: 1, starred: false, title: "My event" });

    expect(JSON.parse(window.localStorage.getItem("event_meta_1"))).to.be.eql({ starred: false });
  });

  context("with a falsy localstorage identifer", function() {
    it("doesn't store the offline attributes", function() {
      new Event({ starred: false, title: "My event" });

      expect(window.localStorage.length).to.be.equal(0);
    });
  });
});
