import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let transactionIds = List.empty<Nat>();

  type Byte = Nat8;
  type Price = Nat;
  type FileId = Text;
  type ProductId = Text;

  type ProductListing = {
    id : ProductId;
    seller : Principal;
    title : Text;
    description : Text;
    price : Nat;
    category : Text;
    image : Storage.ExternalBlob;
    timestamp : Time.Time;
  };

  module ProductListing {
    public func compareByPrice(a : ProductListing, b : ProductListing) : Order.Order {
      switch (Nat.compare(a.price, b.price)) {
        case (#equal) { Text.compare(a.title, b.title) };
        case (order) { order };
      };
    };

    public func compareByCategory(a : ProductListing, b : ProductListing) : Order.Order {
      switch (Text.compare(a.category, b.category)) {
        case (#equal) { Nat.compare(a.price, b.price) };
        case (order) { order };
      };
    };
  };

  type TransactionId = Nat;

  type Transaction = {
    id : TransactionId;
    buyer : Principal;
    seller : Principal;
    amount : Price;
    commission : Price;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  let transactionsStore = Map.empty<TransactionId, Transaction>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var totalCommission : Price = 0;
  var nextTransactionId : Nat = 0;

  let productListingsStore = Map.empty<ProductId, ProductListing>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Utility to create unique IDs using timestamps
  func _generateUniqueId(prefix : Text) : Text {
    let baseId = prefix # Time.now().toText();
    var uniqueId = baseId;
    var counter = 1;

    // Check for product listing conflicts first
    while (_idExists(uniqueId)) {
      uniqueId := baseId # "_" # counter.toText();
      counter += 1;
    };
    uniqueId;
  };

  // Check if an ID already exists in either store
  func _idExists(id : Text) : Bool {
    productListingsStore.containsKey(id);
  };

  public query ({ caller }) func getProductById(id : ProductId) : async ?ProductListing {
    switch (productListingsStore.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?listing) { ?listing };
    };
  };

  public query ({ caller }) func productListingExists(id : ProductId) : async Bool {
    productListingsStore.containsKey(id);
  };

  public query ({ caller }) func transactionExists(transactionId : TransactionId) : async Bool {
    transactionsStore.containsKey(transactionId);
  };

  public shared ({ caller }) func createProductListing(title : Text, description : Text, price : Price, category : Text, image : Storage.ExternalBlob) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create product listings");
    };

    if (title.size() == 0 or description.size() == 0) {
      Runtime.trap("Title and description cannot be empty.");
    };

    let id = _generateUniqueId("product_");
    let listing : ProductListing = {
      id;
      seller = caller;
      title;
      description;
      price;
      category;
      image;
      timestamp = Time.now();
    };

    productListingsStore.add(id, listing);
    id;
  };

  public shared ({ caller }) func createTransaction(buyer : Principal, seller : Principal, amount : Price, commission : Price) : async TransactionId {
    // Only the buyer or an admin can create a transaction
    if (caller != buyer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the buyer or admin can create transactions");
    };

    let id = nextTransactionId;
    let transaction : Transaction = {
      id;
      buyer;
      seller;
      amount;
      commission;
      timestamp = Time.now();
    };

    transactionsStore.add(id, transaction);
    totalCommission += commission;
    nextTransactionId += 1;
    id;
  };

  public query ({ caller }) func getAllProductListings() : async [ProductListing] {
    productListingsStore.values().toArray();
  };

  public query ({ caller }) func getProductListingsSorted(sortBy : Text) : async [ProductListing] {
    let listings = productListingsStore.values().toArray();
    switch (sortBy) {
      case ("price") { listings.sort(ProductListing.compareByPrice) };
      case ("category") { listings.sort(ProductListing.compareByCategory) };
      case (_) { listings };
    };
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all transactions");
    };
    transactionsStore.values().toArray();
  };

  public query ({ caller }) func getMyTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    let allTransactions = transactionsStore.values().toArray();
    allTransactions.filter<Transaction>(
      func(t : Transaction) : Bool {
        t.buyer == caller or t.seller == caller;
      },
    );
  };

  public query ({ caller }) func getTotalCommission() : async Price {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view total commission");
    };
    totalCommission;
  };
};
