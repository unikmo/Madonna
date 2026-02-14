import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MomentCode from '@/models/MomentCode';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function DELETE(request: NextRequest) {
  try {
    const { code, mediaUrl } = await request.json();

    if (!code || !mediaUrl) {
      return NextResponse.json(
        { error: 'Code and mediaUrl are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const momentCode = await MomentCode.findOne({ code: code.toUpperCase().trim() });

    if (!momentCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    // Check if code is still new (not claimed)
    if (momentCode.status !== 'new') {
      return NextResponse.json(
        { error: 'Code has already been claimed. Cannot delete media.' },
        { status: 400 }
      );
    }

    // Find the media item
    const mediaIndex = momentCode.media.findIndex((m) => m.url === mediaUrl);

    if (mediaIndex === -1) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Extract public ID from Cloudinary URL
    // Cloudinary URLs format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{ext}
    // Or: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{public_id}.{ext}
    try {
      const urlParts = mediaUrl.split('/upload/');
      if (urlParts.length > 1) {
        // Get everything after /upload/
        let publicIdPath = urlParts[1];
        
        // Remove version if present (format: v1234567890/)
        publicIdPath = publicIdPath.replace(/^v\d+\//, '');
        
        // Remove file extension
        const lastDotIndex = publicIdPath.lastIndexOf('.');
        if (lastDotIndex > 0) {
          publicIdPath = publicIdPath.substring(0, lastDotIndex);
        }
        
        // Delete from Cloudinary
        await deleteFromCloudinary(publicIdPath);
      }
    } catch (cloudinaryError: any) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue to remove from database even if Cloudinary deletion fails
    }

    // Remove from database
    momentCode.media.splice(mediaIndex, 1);
    await momentCode.save();

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
