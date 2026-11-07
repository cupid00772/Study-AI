import os
import shutil

src_photos_dir = r"c:\Users\Cupid\Downloads\Study-space\Reference\NCU_Classes\通識地球物理\校園實習\校園地電實習\TEM experimentsPhotos\jpg"
ref_images_dir = r"C:\Users\Cupid\.gemini\antigravity-ide\brain\aa31e2bd-cf34-4450-924c-b4d0316eee57\scratch\ref_images"
dest_dir = r"c:\Users\Cupid\Downloads\Study-space\Reference\NCU_Classes\通識地球物理\校園實習\校園地電實習\report\images_tem"

os.makedirs(dest_dir, exist_ok=True)

copy_map = {
    # Reference diagrams
    os.path.join(ref_images_dir, "page_1_img_1_20.jpeg"): "fig1_tem_principle.jpg",
    os.path.join(ref_images_dir, "page_3_img_1_49.jpeg"): "fig2_2_noise.jpg",
    os.path.join(ref_images_dir, "page_4_img_2_56.jpeg"): "fig2_4_velocity.jpg",
    os.path.join(ref_images_dir, "page_4_img_4_58.jpeg"): "fig2_5_loop.jpg",
    os.path.join(ref_images_dir, "page_6_img_2_70.jpeg"): "fig3_2_stations_map.jpg",
    os.path.join(ref_images_dir, "page_7_img_1_74.jpeg"): "fig3_3_inversion.jpg",
    
    # User field photos
    os.path.join(src_photos_dir, "20261012_042126578_iOS.jpg"): "fig2_0a_overview.jpg",
    os.path.join(src_photos_dir, "20261012_045402165_iOS.jpg"): "fig2_0b_system_screen.jpg",
    os.path.join(src_photos_dir, "20261012_051200034_iOS.jpg"): "fig2_1a_aluminum_setup.jpg",
    os.path.join(src_photos_dir, "20261012_052148657_iOS.jpg"): "fig2_1b_aluminum_curve.jpg",
    os.path.join(src_photos_dir, "20261012_054027267_iOS.jpg"): "fig2_3a_thick_aluminum_setup.jpg",
    os.path.join(src_photos_dir, "20261012_052654914_iOS.jpg"): "fig2_3b_thick_aluminum_curve.jpg",
    os.path.join(src_photos_dir, "20261012_050205748_iOS.jpg"): "fig3_1a_well_setup.jpg",
    os.path.join(src_photos_dir, "20261012_050237579_iOS.jpg"): "fig3_1b_well_curve.jpg",
    os.path.join(src_photos_dir, "20261012_055519326_iOS.jpg"): "fig3_1c_lawn_setup.jpg",
    os.path.join(src_photos_dir, "20261012_060000053_iOS.jpg"): "fig3_1d_lawn_curve.jpg",
    os.path.join(src_photos_dir, "20261012_060624286_iOS.jpg"): "fig3_2b_run27.jpg",
    os.path.join(src_photos_dir, "20261012_061450789_iOS.jpg"): "fig3_2c_run51.jpg",
    os.path.join(src_photos_dir, "20261012_042215859_iOS.jpg"): "fig4_reflection.jpg",
}

for src, name in copy_map.items():
    dst = os.path.join(dest_dir, name)
    shutil.copy2(src, dst)
    print(f"Copied {os.path.basename(src)} -> {name}")

print("All images organized successfully.")
