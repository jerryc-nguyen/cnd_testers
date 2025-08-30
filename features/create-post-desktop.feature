Feature: Create post on Chuannhadat.com - Desktop Version
  As a logged-in user of chuannhadat.com
  I want to create a new property post
  So that I can list my property for sale

  Background:
    Given I am logged in to chuannhadat.com
    And I navigate to the new post creation page

  @smoke @create-rent-apartment-post @desktop @happy-path
  Scenario: Successfully create a new Rent Apartment post
    When I fill in Nhu cầu field with "Cho thuê"
    And I select Loại bất động sản type "Căn hộ chung cư"
    And I enter the Giá bán "85000000"
    And I enter the Diện tích (m²) "85"
    And I enter the Số phòng ngủ "3"
    And I enter the Số phòng tắm "3"
    And I enter the Dự án "Melody Residences"
    And I enter the Tiêu đề "Căn hộ 2PN - Melody Residences"
    And I enter the Nội dung mô tả "Căn hộ đẹp, view sông, nội thất cao cấp, vị trí thuận tiện"
    And I select Giấy tờ pháp lý "Hợp đồng mua bán"
    And I select Vị trí tầng "4"
    And I select Hướng ban công "Hướng Đông Nam"
    And I select Nội thất "Hoàn thiện cơ bản"
    And I upload property images from local machine
    And I click the Submit button
    Then the post should be created successfully
    And I should see a success confirmation message
    And I take a screenshot "post-created-successfully"

  @smoke @create-sell-apartment-post @desktop @happy-path
  Scenario: Successfully create a new Sell Apartment post
    When I fill in Nhu cầu field with "Bán"
    And I select Loại bất động sản type "Căn hộ chung cư"
    And I enter the Giá bán "4500000000"
    And I enter the Diện tích (m²) "85"
    And I enter the Số phòng ngủ "3"
    And I enter the Số phòng tắm "3"
    And I enter the Dự án "Melody Residences"
    And I enter the Tiêu đề "Căn hộ 2PN - Melody Residences"
    And I enter the Nội dung mô tả "Căn hộ đẹp, view sông, nội thất cao cấp, vị trí thuận tiện"
    And I select Giấy tờ pháp lý "Hợp đồng mua bán"
    And I select Vị trí tầng "4"
    And I select Hướng ban công "Hướng Đông Nam"
    And I select Nội thất "Hoàn thiện cơ bản"
    And I upload property images from local machine
    And I click the Submit button
    Then the post should be created successfully
    And I should see a success confirmation message
    And I take a screenshot "post-created-successfully"

  @smoke @create-sell-nha-rieng-post @desktop @happy-path
  Scenario: Successfully create a new Sell Nhà Riêng
    When I fill in Nhu cầu field with "Bán"
    And I select Loại bất động sản type "Nhà riêng"
    And I enter the Giá bán "4500000000"
    And I enter the Diện tích (m²) "100"
    And I enter the Số phòng ngủ "3"
    And I enter the Số phòng tắm "3"
    And I enter by CMDK autocomplete label "Tỉnh/ Thành phố", input: "Đà Nẵng"
    And I enter by CMDK autocomplete label "Quận/ Huyện", input: "Quận Liên Chiểu"
    And I enter by CMDK autocomplete label "Phường/ Xã", input: "Phường Hòa Khánh Nam"
    And I enter by CMDK autocomplete label "Đường/ Phố", input: "Nguyễn Tất Thành"

    And I enter the Tiêu đề "Bán nhà riêng - Quận Tân Phú"
    And I enter the Nội dung mô tả "Căn hộ đẹp, view sông, nội thất cao cấp, vị trí thuận tiện"
    And I select Giấy tờ pháp lý "Giấy viết tay"
    And I enter Mặt tiền rộng (m) "5"
    And I enter Đường rộng "8"
    And I enter Số tầng "2"
    And I select Hướng nhà/ đất "Hướng Đông"
    And I select Nội thất "Hoàn thiện cơ bản"
    And I upload property images from local machine
    And I click the Submit button
    Then the post should be created successfully
    And I should see a success confirmation message
    And I take a screenshot "post-created-successfully"

  @smoke @create-rent-nha-rieng-post @desktop @happy-path
  Scenario: Successfully create a new Rent Nhà Riêng
    When I fill in Nhu cầu field with "Cho thuê"
    And I select Loại bất động sản type "Nhà riêng"
    And I enter the Giá bán "7500000"
    And I enter the Diện tích (m²) "100"
    And I enter the Số phòng ngủ "3"
    And I enter the Số phòng tắm "3"
    
    And I enter by CMDK autocomplete label "Tỉnh/ Thành phố", input: "Đà Nẵng"
    And I enter by CMDK autocomplete label "Quận/ Huyện", input: "Quận Liên Chiểu"
    And I enter by CMDK autocomplete label "Phường/ Xã", input: "Phường Hòa Khánh Nam"
    And I enter by CMDK autocomplete label "Đường/ Phố", input: "Nguyễn Tất Thành"

    And I enter the Tiêu đề "Bán nhà riêng - Quận Tân Phú"
    And I enter the Nội dung mô tả "Căn hộ đẹp, view sông, nội thất cao cấp, vị trí thuận tiện"
    And I select Giấy tờ pháp lý "Giấy viết tay"
    And I enter Mặt tiền rộng (m) "5"
    And I enter Đường rộng "8"
    And I enter Số tầng "2"
    And I select Hướng nhà/ đất "Hướng Đông"
    And I select Nội thất "Hoàn thiện cơ bản"
    And I upload property images from local machine
    And I click the Submit button
    Then the post should be created successfully
    And I should see a success confirmation message
    And I take a screenshot "post-created-successfully"
