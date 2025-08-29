Feature: Create post on Chuannhadat.com - Desktop Version
  As a logged-in user of chuannhadat.com
  I want to create a new property post
  So that I can list my property for sale

  Background:
    Given I am logged in to chuannhadat.com
    And I navigate to the new post creation page

  @smoke @create-post @desktop @happy-path
  Scenario: Successfully create a new Sell Apartment post
    When I fill in Nhu cầu field with "Cho thuê"
    And I select Loại bất động sản type "Căn hộ chung cư"
    And I enter the Giá bán "5000000000"
    And I enter the Diện tích (m²) "85"
    And I enter the Số phòng ngủ "3"
    And I enter the Số phòng tắm "3"
    And I enter the Dự án "Vinhomes Central Park"
    And I enter the Tiêu đề "Căn hộ 2PN view sông tại Vinhomes Central Park"
    And I enter the Nội dung mô tả "Căn hộ đẹp, view sông, nội thất cao cấp, vị trí thuận tiện"
    And I select Giấy tờ pháp lý "Sổ hồng"
    And I select Vị trí tầng "Tầng cao"
    And I select Hướng ban công "Đông Nam"
    And I select Nội thất "Đầy đủ nội thất"
    And I upload property images from local machine
    And I click the Submit button
    Then the post should be created successfully
    And I should see a success confirmation message
    And I take a screenshot "post-created-successfully"
