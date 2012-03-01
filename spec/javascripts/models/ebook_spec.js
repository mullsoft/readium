describe("ebook", function() {

	var pacDocStub = {
		on: function() {},
		fetch: function() {},
		set: function() {},
		get: function() {}
	}

	
	describe("initialization", function() {

		var ebook;
		
		beforeEach(function() {
			
			spyOn(Readium.Models, "PackageDocument").andReturn(pacDocStub);
		});

		it('constructs the package document', function() {
			ebook = new Readium.Models.EbookBase({"package_doc_path": "banana"});
			expect(Readium.Models.PackageDocument).toHaveBeenCalled();
		});

		it('passes the "package_doc_path" path to packDoc contructor', function() {
			ebook = new Readium.Models.EbookBase({"package_doc_path": "banana"});
			var args = Readium.Models.PackageDocument.mostRecentCall.args;
			expect(args[1].file_path).toEqual("banana");
		});

		it("calls fetch on the package document", function() {
			spyOn(pacDocStub, "fetch");
			ebook = new Readium.Models.EbookBase({"package_doc_path": "banana"});
			expect(pacDocStub.fetch).toHaveBeenCalled()
		});

		it("sets the page number after successful fetch", function() {
			spyOn(pacDocStub, "fetch");
			spyOn(pacDocStub, "set");
			ebook = new Readium.Models.EbookBase({"package_doc_path": "banana"});
			var args = pacDocStub.fetch.mostRecentCall.args;
			args[0].success();
			expect(pacDocStub.set).toHaveBeenCalled();	
		});

	});


	describe("paginating", function() {

		var ebook;
		
		beforeEach(function() {
			pacDocStub.goToNextSection = function() {}
			spyOn(Readium.Models, "PackageDocument").andReturn(pacDocStub);
			ebook = new Readium.Models.EbookBase;
		});

		it('sets the current page to 1 by default', function() {
			ebook = new Readium.Models.EbookBase({"package_doc_path": "banana"});
			expect(ebook.get("current_page")).toEqual([1]);
		});

		it("increments the page number if there are more pages", function() {
			ebook.set({"num_pages": 10});
			ebook.nextPage();
			expect(ebook.get("current_page")).toEqual([2]);
		});

		//Needs to be fixed
		/*it('increments the section of package doc if there are no more pages', function() {
			spyOn(pacDocStub, "goToNextSection").andReturn(true);
			ebook.set({"num_pages": 10});
			ebook.set({"current_page": 10});
			ebook.nextPage();
			expect(pacDocStub.goToNextSection).toHaveBeenCalled()
			expect(ebook.get("current_page")).toEqual(1);
		})*/

	});


	describe("unit test from one-up to two-up", function() {

		var ebook;
		
		beforeEach(function() {
			pacDocStub.goToNextSection = function() {}
			spyOn(Readium.Models, "PackageDocument").andReturn(pacDocStub);
			ebook = new Readium.Models.EbookBase;
		});

		it('if current page is even when two-up is toggled, show even page then the next page which is odd', function() {
			ebook.set({"current_page": [2]});
			ebook.toggleTwoUp();
			expect(ebook.get("current_page")).toEqual([2,3]);
		});

		it('if current page is odd when two-up is toggled, show previous page which is even then the odd page', function() {
			ebook.set({"current_page": [3]});
			ebook.toggleTwoUp();
			expect(ebook.get("current_page")).toEqual([2,3]);
		});

		it('if current page is 1 when two-up is toggled, show page 0 and page 1', function() {
			ebook.set({"current_page": [1]});
			ebook.toggleTwoUp();
			expect(ebook.get("current_page")).toEqual([0,1]);
		});

	});

	describe("unit test from two-up to one-up", function() {

		var ebook;
		
		beforeEach(function() {
			pacDocStub.goToNextSection = function() {}
			spyOn(Readium.Models, "PackageDocument").andReturn(pacDocStub);
			ebook = new Readium.Models.EbookBase;
		});

		it('when toggling to one-up, it shows the lowest number page', function(){
			ebook.set({"two_up": true});
			ebook.set({"current_page": [6,7]});
			ebook.toggleTwoUp();
			expect(ebook.get("current_page")).toEqual([6]);
		});

		it('when toggling to one-up when the current page is 0 & 1, it shows page 1', function(){
			ebook.set({"two_up": true});
			ebook.set({"current_page": [0,1]});
			ebook.toggleTwoUp();
			expect(ebook.get("current_page")).toEqual([1]);
		});

	});

});