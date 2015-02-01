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
    it("ignores the model default attributes", function() {
      window.localStorage.setItem("event_meta_1", JSON.stringify({ starred: true }));

      var MyCustomEvent = Event.extend({
        defaults: {
          starred: false
        }
      });

      var myEvent = new MyCustomEvent({ id: 1, title: "My event" });

      expect(myEvent.toJSON()).to.be.eql({ id: 1, title: "My event", starred: true });
      expect(JSON.parse(window.localStorage.getItem("event_meta_1"))).to.be.eql({ starred: true });
    });

    it("instantiating a model should brings these infos as regular attributes", function() {
      window.localStorage.setItem("event_meta_1", JSON.stringify({ starred: true }));

      var myEvent = new Event({ id: 1, title: "My event" });

      expect(myEvent.toJSON()).to.be.eql({ id: 1, title: "My event", starred: true });
    });

    it("ignores the model default attributes", function() {
      window.localStorage.setItem("event_meta_1", JSON.stringify({ starred: true }));

      var MyCustomEvent = Event.extend({
        defaults: {
          starred: false
        }
      });

      var myEvent = new MyCustomEvent({ id: 1, title: "My event" });

      expect(myEvent.toJSON()).to.be.eql({ id: 1, title: "My event", starred: true });
      expect(JSON.parse(window.localStorage.getItem("event_meta_1"))).to.be.eql({ starred: true });
    });
  });

  context("with a falsy localstorage identifer", function() {
    it("doesn't store the offline attributes", function() {
      new Event({ starred: false, title: "My event" });

      expect(window.localStorage.length).to.be.equal(0);
    });
  });

  context("without previous persisted offline attributes", function() {
    it("stores default attributes which are offline attributes", function() {
      var MyCustomEvent = Event.extend({
        defaults: {
          starred: false
        }
      });

      var myEvent = new MyCustomEvent({ id: 1, title: "My event" });

      expect(JSON.parse(window.localStorage.getItem("event_meta_1"))).to.be.eql({ starred: false });
    });
  });
});
