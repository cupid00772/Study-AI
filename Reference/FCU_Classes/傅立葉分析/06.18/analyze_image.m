% Read images
img1 = imread('S__11788318乙.jpg');
img2 = imread('S__11878405乙.jpg');

% Convert to grayscale if they are RGB
if size(img1, 3) == 3
    img1 = rgb2gray(img1);
end
if size(img2, 3) == 3
    img2 = rgb2gray(img2);
end

% Process function
function process_image(img, name)
    % Compute FFT
    F = fft2(double(img));
    Fshift = fftshift(F);
    
    % Magnitude spectrum
    mag = log(1 + abs(Fshift));
    
    % Low-pass filters with different D0
    [M, N] = size(img);
    u = 0:(M-1);
    v = 0:(N-1);
    idx = find(u > M/2);
    u(idx) = u(idx) - M;
    idy = find(v > N/2);
    v(idy) = v(idy) - N;
    [V, U] = meshgrid(v, u);
    D = sqrt(U.^2 + V.^2);
    D = fftshift(D); % shift D to center
    
    D0_list = [10, 30, 80, 150];
    
    figure('Position', [100, 100, 1200, 800], 'Visible', 'off');
    
    % Original and Spectrum
    subplot(2, 3, 1); imshow(img); title('Original Image');
    subplot(2, 3, 2); imshow(mag, []); title('Magnitude Spectrum');
    
    % Apply LPF
    for i = 1:length(D0_list)
        D0 = D0_list(i);
        H = double(D <= D0); % Ideal LPF
        G = Fshift .* H;
        g = real(ifft2(ifftshift(G)));
        
        subplot(2, 3, i+2);
        imshow(uint8(g));
        title(sprintf('LPF (D_0 = %d)', D0));
    end
    
    saveas(gcf, sprintf('%s_analysis.png', name));
end

process_image(img1, 'img1');
process_image(img2, 'img2');
